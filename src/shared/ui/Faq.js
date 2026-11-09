export default function Faq({ items }) {
  return (
    <section className="section faq">
      <div className="sectionTag">A FEW THINGS WORTH KNOWING</div>
      <h2>Before the first note.</h2>
      {items.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </section>
  );
}
