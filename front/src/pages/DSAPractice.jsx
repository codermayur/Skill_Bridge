import SharedPracticePage from "../components/SharedPracticePage";

const DSA_CONFIGS = {
  "dsa-java":   { title: "DSA — Java",   emoji: "☕" },
  "dsa-python": { title: "DSA — Python", emoji: "🐍" },
  "dsa-cpp":    { title: "DSA — C++",    emoji: "⚡" },
};

export default function DSAPractice({ language }) {
  const { title, emoji } = DSA_CONFIGS[language] || { title: "DSA", emoji: "📊" };
  return <SharedPracticePage language={language} title={title} emoji={emoji} />;
}
