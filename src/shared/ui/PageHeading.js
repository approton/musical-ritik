export default function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="pageHeading">
      <div className="sectionTag">{eyebrow}</div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
