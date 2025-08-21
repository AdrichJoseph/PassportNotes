import { useEffect, useState } from "react"; // Removed unused useEffect
import supabase from './supabase'; // Importing supabase for future use
import "./style.css";


const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    continent: "asia",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source: "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    continent: "north america",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    continent: "africa",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span style={{ fontSize: "40px" }}>{count}</span>
      <button className="btn btn-large" onClick={() => setCount((count) => count + 1)}>
        +1
      </button>
    </div>
  );
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIstLoading] = useState(false);
  const [currentContinent, setCurrentContinent] = useState("all");




  useEffect(function () {
    // from supabase api docs
    async function getFacts() 
    {
      setIstLoading(true);


      // responsible for querying the database and filtering the data based on the selected continent
      let query = supabase.from('facts').select('*');

      if (currentContinent !== "all")
        query = query.eq('continent', currentContinent);

      const { data: facts, error } = await query
      .order('votesInteresting', {ascending: false})
      .limit(1000);

      

      if(!error) setFacts(facts);
      else alert("There was a problem getting the notes from the database, please try again later");

      setIstLoading(false);
    }
    getFacts();
  },  [currentContinent]); // Re-run when currentContinent changes

  return (
    <>
      <Header showForm={showForm} 
      setShowForm={setShowForm} />

      {showForm ? <NewFactForm setFacts={setFacts} continent={continent} 
      setShowForm={setShowForm}/> : null}

      <main className="main">
        <CategoryFilter setCurrentContinent=
         {setCurrentContinent}/>

        {isLoading ? <Loader /> :  <FactList facts=
        {facts} setFacts={setFacts}/> }
      </main>
    </>
  );
}




function Loader() {
  return (
    <div style={{ textAlign: "center" }}>
      <svg
        width="50"
        height="50"
        align="center"
        fontSize="32px"
        viewBox="0 0 24 24"
        style={{ animation: "spin 1s linear infinite" }}
      >
        <circle cx="12" cy="12" r="10" fill="none" stroke="#000" strokeWidth="2" />
      </svg>
      <p>Gathering Notes...</p>
    </div>
  );
}


function Header({ showForm, setShowForm }) {
  const appTitle = "Passport Notes";

  return (
    <header className="header">
      <div className="logo">
        <img src="lykalogo.png" height="68" width="68" alt="Passport Notes Logo" />
        <h1>{appTitle}</h1>
      </div>

      <button className="btn btn-large btn-open" onClick={() => setShowForm((show) => !show)}>
        {showForm ? "Close" : "Post a Note"}
      </button>
    </header>
  );
}

const continent = [
  { name: "asia", color: "#8C1007" },
  { name: "europe", color: "#001F3F" },
  { name: "north america", color: "#0A4D92" },
  { name: "south america", color: "#086e7d" },
  { name: "africa", color: "#274001" },
  { name: "oceania", color: "#20B2AA" },
  { name: "antarctica", color: "#B0C4DE" },
];

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, continent, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [continentSelected, setContinentSelected] = useState(""); // Renamed for clarity
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;


  

  async function handleSubmit(e) {
    e.preventDefault();
    

    if (text && isValidHttpUrl(source) && continentSelected && textLength <= 250) {

      setIsUploading(true);
      
      const { data: newFact, error } = await supabase
      .from('facts')
      .insert([{text, source, continent: continentSelected}])
      .select();
      setIsUploading(false);




      console.log(newFact);


      if (!error) setFacts((facts) => [newFact[0], ...facts]); // Add new fact to the top
      
      // Reset form fields
      setText("");
      setSource("");
      setContinentSelected(""); 

      setShowForm(false); // Close the form after submission
      

    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Any Notes, Traveler?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{250 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="A Source to your Discovery"
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={continentSelected}
        onChange={(e) => setContinentSelected(e.target.value)}
      disabled={isUploading}
      >
        <option value="">Choose a Continent:</option>
        {continent.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post!
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentContinent }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all-categories"
          onClick={()=>setCurrentContinent("all")}
          >
            All
          </button>
        </li>
        {continent.map((c) => (
          <li key={c.name} className="category">
            <button className="btn btn-category" style={{ backgroundColor: c.color }}
            onClick={()=>setCurrentContinent(c.name)}
            >
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {

  if (facts.length === 0) 
    return ( <p className="message">No passport note found for this continent yet! Post the first one ✌️</p>);

  return (
    <section>
      <ul className="facts">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>Travelers have posted {facts.length} passport notes so far, post yours!</p>
    </section>
  );
} 

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState
  (false);
  const isDisputed = fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;


  const cat = continent.find((c) => c.name === fact.continent) || continent.find((c) => c.name === "all");

  
  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } =
    await supabase
    .from('facts')
    .update({ [columnName] : fact[columnName] + 1})
    .eq('id', fact.id)
    .select();
    setIsUpdating(false);

    console.log(updatedFact);
    // Update the local state with the new votes
    if (!error) 
      setFacts((facts) => 
        facts.map((f) => (f.id === fact.id ? 
        updatedFact[0]: f))
      ); 
  }

  return (
<li className="fact">
  <p>
    {isDisputed ? (
      <span className="disputed">
        ✈️ Traveler’s Stamp: Questionable Note ⛔️
      </span>
    ) : null}
    {fact.text}
    <a className="source" href={fact.source} target="_blank" rel="noreferrer">
      (Source)
    </a>
  </p>

  <span className="tag" style={{ backgroundColor: cat.color }}>
    {fact.continent.toUpperCase()}
  </span>

  <div className="vote-buttons">
    <button onClick={() => handleVote("votesInteresting")} disabled={isUpdating}>
      👍 {fact.votesInteresting}
    </button>
    <button onClick={() => handleVote("votesMindblowing")} disabled={isUpdating}>
      🤯 {fact.votesMindblowing}
    </button>
    <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
      ⛔️ {fact.votesFalse}
    </button>
  </div>
</li>

  );
}

export default App;