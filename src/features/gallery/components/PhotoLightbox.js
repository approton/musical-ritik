"use client";
import Image from "next/image";
import Modal from "@/shared/ui/Modal";
export default function PhotoLightbox({ photo, onClose }) {
  return (
    <Modal title={photo.title} onClose={onClose}>
      <Image
        className="lightboxImage"
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
      />
    </Modal>
  );
}
