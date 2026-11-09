"use client";
import { useState } from "react";
import FloatingField from "@/shared/ui/FloatingField";
import Pressable from "@/shared/ui/Pressable";
import { useIndiaLocations } from "../hooks/useIndiaLocations";
export default function LocationPicker({ data, update, errors }) {
  const { states, cities, status } = useIndiaLocations(data.state);
  const [manual, setManual] = useState(false);
  const online = data.locationMode === "online";
  return (
    <fieldset className="locationPicker">
      <legend>Where will the music happen?</legend>
      <div className="locationModes">
        <Pressable
          aria-pressed={!online}
          className={!online ? "modeSelected" : ""}
          onClick={() => update("locationMode", "in-person")}
        >
          In person ↗
        </Pressable>
        <Pressable
          aria-pressed={online}
          className={online ? "modeSelected" : ""}
          onClick={() => update("locationMode", "online")}
        >
          Online appointment
        </Pressable>
      </div>
      {!online && (
        <div className="formGrid">
          <label>
            Country
            <input value="India" readOnly aria-label="Country" />
          </label>
          <label htmlFor="booking-state">
            State / Union territory
            <select
              id="booking-state"
              value={data.state}
              onChange={(e) => {
                update("state", e.target.value);
                setManual(false);
              }}
              aria-invalid={Boolean(errors.state)}
            >
              <option value="">Choose a state</option>
              {states.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
            {errors.state && <span className="fieldError">{errors.state}</span>}
          </label>
          {manual || status === "error" ? (
            <FloatingField
              id="booking-city"
              label="City / town"
              value={data.city}
              error={errors.city}
              onChange={(e) => update("city", e.target.value)}
            />
          ) : (
            <label htmlFor="booking-city">
              City / town
              <select
                id="booking-city"
                value={data.city}
                disabled={!data.state || status === "loading"}
                onChange={(e) => update("city", e.target.value)}
                aria-invalid={Boolean(errors.city)}
              >
                <option value="">
                  {status === "loading" ? "Loading cities…" : "Choose a city"}
                </option>
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
              {errors.city && <span className="fieldError">{errors.city}</span>}
            </label>
          )}
          <div className="locationHelp">
            <span>
              {status === "error"
                ? "City list unavailable. Please enter your town manually."
                : "Your town not listed?"}
            </span>
            <Pressable className="textLink" onClick={() => setManual((v) => !v)}>
              {manual ? "Use city list" : "Enter city manually"}
            </Pressable>
          </div>
        </div>
      )}
      <FloatingField
        label={online ? "Meeting platform / preferred call details" : "Venue / address"}
        id="booking-venue"
        value={data.venue}
        onChange={(e) => update("venue", e.target.value)}
        error={errors.venue}
      />
    </fieldset>
  );
}
