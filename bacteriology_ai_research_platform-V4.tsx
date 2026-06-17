import React, { useState } from 'react';
import { 
  Microscope, Database, Code, BookOpen, Activity, Play, 
  TerminalSquare, ChevronDown, ChevronUp, Link as LinkIcon, ExternalLink,
  Cpu, Beaker, FileText, Search, Wand2, TestTube2, FlaskConical, Globe
} from 'lucide-react';

// API Key provisioned by environment
const apiKey = "";

// =========================================
// GLOBAL GEMINI API CALLER
// =========================================
const executeGeminiCall = async (prompt, systemPrompt, useSearch = false) => {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  if (systemPrompt) payload.systemInstruction = { parts: [{ text: systemPrompt }] };
  if (useSearch) payload.tools = [{ "google_search": {} }];

  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
      if (res.status !== 429 && res.status < 500) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${res.status}`);
      }
    } catch (e) {
      if (i === 4) throw e;
    }
    await new Promise(r => setTimeout(r, delay));
    delay *= 2;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('ecosystem');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
              AI-Bacteriology Hub
            </span>
          </div>
          <div className="text-xs text-slate-400 text-right hidden sm:block">
            <div className="font-semibold text-slate-300">Principal Investigator: Vahhab (Nathan) Piranfar</div>
            <div>Jersey City Lab • 2026 Research Cycle</div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-2 shrink-0 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4 px-3">Project Modules</div>
          
          <NavButton 
            id="ecosystem" 
            icon={<Globe className="w-5 h-5" />} 
            label="Global Ecosystem" 
            desc="Existing Tools & Guides"
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <NavButton 
            id="integrations" 
            icon={<Cpu className="w-5 h-5" />} 
            label="Our Integrations" 
            desc="Using Local Scripts"
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <NavButton 
            id="lab" 
            icon={<Beaker className="w-5 h-5" />} 
            label="Research & AI Lab" 
            desc="Simulations & Protocols"
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-900/50">
          {activeTab === 'ecosystem' && <EcosystemView />}
          {activeTab === 'integrations' && <IntegrationsView />}
          {activeTab === 'lab' && <LabView />}
        </main>
      </div>
    </div>
  );
}

/* =========================================
   COMPONENTS & VIEWS
   ========================================= */

function NavButton({ id, icon, label, desc, activeTab, setActiveTab }) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-start gap-3 p-3 rounded-xl transition-all text-left ${
        isActive 
          ? 'bg-blue-600/10 border border-blue-500/50 text-blue-400' 
          : 'hover:bg-slate-800 border border-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
      <div className={`mt-0.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
        {icon}
      </div>
      <div>
        <div className={`font-semibold ${isActive ? 'text-blue-300' : 'text-slate-200'}`}>{label}</div>
        <div className="text-xs opacity-70 mt-0.5">{desc}</div>
      </div>
    </button>
  );
}

// -----------------------------------------
// SECTION 1: GLOBAL ECOSYSTEM (EXPANDED)
// -----------------------------------------
function EcosystemView() {
  const tools = [
    {
      name: "NCBI BLAST & GenBank",
      tags: ["Alignment", "Database", "Fundamental"],
      desc: "The absolute foundation of bioinformatics. We use the Basic Local Alignment Search Tool (BLAST) against the GenBank database to identify unknown bacterial strains recovered from wet-lab samples.",
      steps: [
        "Extract raw FASTA sequences obtained from our 16S rRNA PCR amplification.",
        "Navigate to NCBI BLAST (megablast for highly similar sequences).",
        "Input the sequence and target the '16S ribosomal RNA (Bacteria and Archaea)' database.",
        "Analyze the resulting E-values and bit scores to confidently confirm strain identity before downstream AI analysis."
      ]
    },
    {
      name: "BV-BRC (Bacterial and Viral Bioinformatics Resource Center)",
      tags: ["Genomics", "Database", "Pathogens"],
      desc: "The premier information system designed to support research on bacterial infectious diseases. We use this to pull raw genomic FASTA files and metadata for large-scale training.",
      steps: [
        "Navigate to the BV-BRC portal and search for the target pathogen (e.g., Klebsiella pneumoniae).",
        "Filter datasets by 'Whole Genome Sequencing' (WGS) and select clinically relevant hospital strains.",
        "Export the assembly FASTA files and metadata CSVs for local Python processing.",
        "Run genome annotation using their built-in RASTtk pipeline to identify coding sequences (CDS)."
      ]
    },
    {
      name: "Galaxy Project",
      tags: ["Pipeline", "Assembly", "Reproducibility"],
      desc: "An open, web-based platform for accessible, reproducible, and transparent computational research. Crucial for heavy preprocessing steps without requiring massive local compute power.",
      steps: [
        "Upload raw Illumina paired-end reads (FASTQ files) to the secure Galaxy workspace.",
        "Run FastQC to assess read quality and Trimmomatic to remove sequencing adapters.",
        "Execute SPAdes or Unicycler for de novo genome assembly.",
        "Export the cleanly assembled contigs to integrate with our ai_bacteriology.py mapping tools."
      ]
    },
    {
      name: "CARD (Comprehensive Antibiotic Resistance Database)",
      tags: ["AMR", "Ontology", "Analytics"],
      desc: "A rigorously curated collection of characterized, peer-reviewed resistance determinants. This acts as the biological ground-truth for verifying our LLM and predictive modeling outputs.",
      steps: [
        "Access the Resistance Gene Identifier (RGI) tool via the CARD web interface.",
        "Upload the protein FASTA files generated from our assembly pipelines.",
        "Set the alignment criteria (Strict vs Perfect) depending on whether we suspect a novel mutation.",
        "Export the JSON report detailing efflux pumps, beta-lactamases, and mutation-driven resistance markers."
      ]
    },
    {
      name: "KBase (DOE Systems Biology Knowledgebase)",
      tags: ["Metabolism", "Predictive Modeling", "Systems Bio"],
      desc: "An advanced platform for systems biology. We leverage KBase to build predictive metabolic models, fulfilling the 'Predictive Modeling of Bacterial Growth' branch of our AI architecture.",
      steps: [
        "Import the annotated pathogen genome into a new KBase Narrative.",
        "Build a draft metabolic model using the 'Build Metabolic Model' app to map biological pathways.",
        "Run Flux Balance Analysis (FBA) to simulate bacterial growth under different environmental conditions or antibiotic stress.",
        "Cross-reference computational growth predictions with our physical wet-lab MIC (Minimum Inhibitory Concentration) assay results."
      ]
    },
    {
      name: "AlphaFold 3 / ESMFold",
      tags: ["Deep Learning", "Structural Biology", "Proteins"],
      desc: "State-of-the-art predictive models for 3D protein folding. We use these to structurally visualize the antimicrobial resistance (AMR) proteins identified in CARD.",
      steps: [
        "Extract the exact amino acid sequence of the identified resistance gene (e.g., a novel carbapenemase).",
        "Input the sequence into the AlphaFold 3 server.",
        "Generate and download the 3D PDB structure.",
        "Use PyMOL or UCSF Chimera to visualize the binding pockets and simulate docking sites for potential novel antibiotic inhibitors."
      ]
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <Globe className="text-blue-400" />
          Global Ecosystem & External Pipelines
        </h1>
        <p className="text-slate-400 mt-2 max-w-4xl leading-relaxed">
          The comprehensive directory of industry-standard bioinformatics platforms utilized by our lab. These systems form the foundation of our data ingestion, processing, and validation pipelines, feeding directly into our custom AI scripts. Expand each tool to view our specific Standard Operating Procedures (SOPs).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool, idx) => (
          <AccordionTool key={idx} tool={tool} />
        ))}
      </div>
    </div>
  );
}

function AccordionTool({ tool }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden h-fit transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-800 transition-colors"
      >
        <div className="flex flex-col items-start text-left pr-4">
          <h3 className="text-lg font-bold text-slate-200 leading-tight">{tool.name}</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {tool.tags.map(tag => (
              <span key={tag} className="text-[10px] uppercase tracking-wider bg-slate-900 border border-slate-700 text-blue-300 px-2 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className={`p-2 rounded-full bg-slate-900 border border-slate-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 pt-4 border-t border-slate-700/50 bg-slate-800/80">
          <p className="text-slate-300 mb-5 text-sm leading-relaxed">{tool.desc}</p>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              SOP / Protocol Steps
            </h4>
            <ol className="space-y-4">
              {tool.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-300">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/40 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-700/50">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------
// SECTION 2: OUR INTEGRATIONS
// -----------------------------------------
function IntegrationsView() {
  const ourTools = [
    {
      name: "ollama_web_search.py",
      icon: <Search className="text-teal-400" />,
      integration: "Integrates with: PubMed & Web Literature",
      desc: "Our custom agentic LLM script. Instead of manually searching PubMed for the latest clinical trials regarding resistance mechanisms, this script utilizes Langchain and SerpAPI to pull live data, summarize it, and feed context into our models.",
      codeSnippet: `agent = initialize_agent(
    tools=[Tool(name="Search", func=search.run, ...)],
    llm=OllamaLLM(model="dolphin-mistral"),
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    return_intermediate_steps=True
)`
    },
    {
      name: "pdftotext.py",
      icon: <FileText className="text-blue-400" />,
      integration: "Integrates with: CARD & BV-BRC Export Reports",
      desc: "Bioinformatics databases often export epidemiological reports as complex PDFs. This script acts as our data ingestion layer, parsing unstructured PDF text into clean string data that our local `test_ollama.py` models can ingest for RAG (Retrieval-Augmented Generation).",
      codeSnippet: `# Automated Corpus Ingestion Pipeline
def parse_clinical_reports(pdf_path):
    raw_text = extract_text_from_pdf(pdf_path)
    cleaned_corpus = sanitize_biological_terms(raw_text)
    return chunk_for_llm(cleaned_corpus)`
    },
    {
      name: "ai_bacteriology.py",
      icon: <TerminalSquare className="text-purple-400" />,
      integration: "Integrates with: Visual Ecosystem Mapping",
      desc: "The architectural backbone of the project. It programmatically generates Graphviz `.png` flowcharts that define the relationships between Diagnosis, Drug Discovery, and Predictive Modeling, allowing us to visualize pipeline changes rapidly.",
      codeSnippet: `def create_ai_bacteriology_flowchart():
    dot = Digraph(comment='AI Applications in Bacteriology')
    dot.node('AI', 'AI in Bacteriology', fillcolor='lightblue')
    dot.edge('AI', 'DrugDiscovery', label=' Enhances')
    dot.render('output_nexus', view=False)`
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <Cpu className="text-teal-400" />
          Local Tool Integrations
        </h1>
        <p className="text-slate-400 mt-2 max-w-3xl">
          How our proprietary Python codebase interacts with the external bioinformatics ecosystem. These tools automate the manual steps defined in the Global Ecosystem section.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ourTools.map((tool, idx) => (
          <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">
                {tool.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-200 font-mono">{tool.name}</h3>
                <div className="text-xs text-teal-400 font-semibold">{tool.integration}</div>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-6 flex-grow">{tool.desc}</p>
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 relative">
              <div className="absolute top-0 right-0 bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded-bl-lg rounded-tr-lg">PYTHON</div>
              <pre className="text-xs text-blue-300 font-mono overflow-x-auto whitespace-pre-wrap">
                {tool.codeSnippet}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------
// SECTION 3: RESEARCH & LAB (API SIMULATION)
// -----------------------------------------
function LabView() {
  const [labTab, setLabTab] = useState('simulator'); // 'simulator', 'protocol_ai', 'articles'

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Beaker className="text-purple-400" />
            Research & AI Lab
          </h1>
          <p className="text-slate-400 mt-2">Simulations, AI protocol drafting, and modeling sandboxes.</p>
        </div>
        
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 self-start md:self-end overflow-x-auto max-w-full">
          <button 
            onClick={() => setLabTab('simulator')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${labTab === 'simulator' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            AMR Simulator
          </button>
          <button 
            onClick={() => setLabTab('protocol_ai')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${labTab === 'protocol_ai' ? 'bg-slate-600 text-white shadow flex items-center gap-2' : 'text-slate-400 hover:text-slate-200 flex items-center gap-2'}`}
          >
            <Wand2 className="w-4 h-4 text-amber-400" />
            AI Protocol Drafter
          </button>
          <button 
            onClick={() => setLabTab('articles')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${labTab === 'articles' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Articles & Solutions
          </button>
        </div>
      </div>

      <div className="flex-grow">
        {labTab === 'simulator' && <GeminiSimulator />}
        {labTab === 'protocol_ai' && <AIProtocolDrafter />}
        {labTab === 'articles' && <ArticlesView />}
      </div>
    </div>
  );
}

// Protocol Drafter
function AIProtocolDrafter() {
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState('sop'); // 'sop' or 'abstract'
  const [output, setOutput] = useState("AI output will appear here. Select a tool on the left to begin.");

  // SOP State
  const [assayType, setAssayType] = useState("PCR Amplification (16S rRNA)");
  const [sopNotes, setSopNotes] = useState("");

  // Abstract State
  const [rawNotes, setRawNotes] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setOutput("Generating response via Gemini 2.5 Flash...");
    
    let prompt = "";
    let systemInstruction = "";

    if (activeTool === 'sop') {
      systemInstruction = "You are an expert Chief Laboratory Technician in a high-level bacteriology research lab. Generate a Standard Operating Procedure (SOP). Use clear markdown headings (e.g., Materials, Setup, Procedure, Safety/Warnings). Be precise and scientific.";
      prompt = `Draft a comprehensive laboratory Standard Operating Procedure (SOP) for the following assay: ${assayType}. \nAdditional researcher notes/parameters to include: ${sopNotes || 'Standard default parameters.'}`;
    } else {
      systemInstruction = "You are an expert scientific editor and principal investigator. Transform unstructured lab notes into a formal, highly professional scientific abstract suitable for a bioinformatics or microbiology journal. Use appropriate nomenclature and structure (Background, Methods, Results, Conclusion).";
      prompt = `Synthesize the following raw, unstructured lab notes into a formal scientific abstract:\n\n${rawNotes}`;
    }

    try {
      const result = await executeGeminiCall(prompt, systemInstruction, false);
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "No synthesis generated.";
      setOutput(text);
    } catch (error) {
      setOutput(`Error generating content: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pb-10">
      {/* Controls Panel */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        
        {/* Tool Selector */}
        <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 flex">
          <button 
            onClick={() => setActiveTool('sop')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTool === 'sop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            SOP Generator
          </button>
          <button 
            onClick={() => setActiveTool('abstract')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTool === 'abstract' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Abstract Synthesizer
          </button>
        </div>

        {/* Dynamic Form */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex-grow">
          {activeTool === 'sop' ? (
            <div className="space-y-4">
              <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
                <TestTube2 className="w-5 h-5 text-blue-400" />
                Lab Protocol Drafter
              </h3>
              <div>
                <label className="text-xs text-slate-400 uppercase font-bold">Assay / Protocol Type</label>
                <select 
                  value={assayType} 
                  onChange={e => setAssayType(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:ring-blue-500 outline-none"
                >
                  <option>PCR Amplification (16S rRNA)</option>
                  <option>Whole Genome Sequencing Prep (Illumina)</option>
                  <option>Minimum Inhibitory Concentration (MIC) Assay</option>
                  <option>CRISPR-Cas9 Plasmid Transformation</option>
                  <option>Gram Staining & Microscopy</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase font-bold">Specific Parameters / Notes</label>
                <textarea 
                  value={sopNotes}
                  onChange={e => setSopNotes(e.target.value)}
                  placeholder="e.g., 'Targeting K. pneumoniae, expecting high GC content, emphasize sterile technique...'"
                  className="w-full h-32 mt-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 resize-none focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-400" />
                Raw Data to Abstract
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-2">
                Paste your messy lab notes, quick observations, or unformatted data. The AI will synthesize it into a formal journal abstract.
              </p>
              <textarea 
                value={rawNotes}
                onChange={e => setRawNotes(e.target.value)}
                placeholder="e.g., 'Tested 5 strains of PA. Strains 2 and 4 survived colistin at 4ug/ml. Looks like efflux pump overexpression. Sequencing confirmed mcr-1 was absent...'"
                className="w-full h-48 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 resize-none focus:outline-none focus:border-teal-500"
              ></textarea>
            </div>
          )}

          <button 
            onClick={handleGenerate}
            disabled={loading || (activeTool === 'abstract' && !rawNotes.trim())}
            className={`w-full mt-6 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition disabled:opacity-50 ${activeTool === 'sop' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-teal-600 hover:bg-teal-500'}`}
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Wand2 className="w-4 h-4" />}
            ✨ {activeTool === 'sop' ? 'Draft SOP' : 'Synthesize Abstract'}
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="w-full lg:w-2/3 bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col shadow-2xl h-[600px] overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4 sticky top-0 bg-slate-950/90 backdrop-blur">
          <Wand2 className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Generated Output</span>
        </div>
        
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
             <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
             <p className="animate-pulse">Synthesizing biological data...</p>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none text-slate-300">
            {output.split('\n').map((line, i) => {
              // Extremely simple markdown-to-html rendering for clean output
              if (line.startsWith('###')) return <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2">{line.replace('###', '')}</h3>;
              if (line.startsWith('##')) return <h2 key={i} className="text-xl font-bold text-blue-400 mt-6 mb-3 border-b border-slate-800 pb-1">{line.replace('##', '')}</h2>;
              if (line.startsWith('#')) return <h1 key={i} className="text-2xl font-bold text-teal-400 mt-6 mb-4">{line.replace('#', '')}</h1>;
              if (line.startsWith('* ')) return <li key={i} className="ml-4 list-disc marker:text-blue-500">{line.replace('* ', '')}</li>;
              if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc marker:text-blue-500">{line.replace('- ', '')}</li>;
              if (line.trim() === '') return <br key={i} />;
              // Handle bolding (**text**)
              const formattedLine = line.split(/(\*\*.*?\*\*)/).map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={index} className="text-slate-100">{part.slice(2, -2)}</strong>;
                }
                return part;
              });

              return <p key={i} className="mb-2 leading-relaxed">{formattedLine}</p>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function GeminiSimulator() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState([
    { type: 'system', text: "> AI Biological Simulator Initialized." },
    { type: 'system', text: "> Select parameters or enter a custom query to run the LLM." }
  ]);
  const [pathogen, setPathogen] = useState("Acinetobacter baumannii (CRAB)");
  const [antibiotic, setAntibiotic] = useState("Colistin");
  const [customQuery, setCustomQuery] = useState("");

  const runSimulation = async (type) => {
    setLoading(true);
    
    let promptText = "";
    let systemText = "";
    let isSearch = false;

    if (type === 'sim') {
      setOutput(prev => [...prev, { type: 'action', text: `Executing metabolic analysis: ${pathogen} vs ${antibiotic}...` }]);
      systemText = "You are a computational microbiologist. Provide a succinct 2-paragraph analysis of the resistance mechanism and therapeutic outcome.";
      promptText = `Analyze the interaction between "${pathogen}" and "${antibiotic}". What are the genetic determinants of resistance?`;
    } else {
      if (!customQuery) { setLoading(false); return; }
      setOutput(prev => [...prev, { type: 'action', text: `Agentic Search Query: "${customQuery}"...` }]);
      systemText = "You are a clinical research AI. Synthesize recent findings.";
      promptText = customQuery;
      isSearch = true;
      setCustomQuery("");
    }

    try {
      const result = await executeGeminiCall(promptText, systemText, isSearch);
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "No output generated.";
      setOutput(prev => [...prev, { type: 'result', text: text }]);
    } catch (error) {
      setOutput(prev => [...prev, { type: 'error', text: `API Error: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pb-10">
      {/* Controls Panel */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
          <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            AMR Simulator
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase font-bold">Pathogen</label>
              <select 
                value={pathogen} 
                onChange={e => setPathogen(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:ring-blue-500 outline-none"
              >
                <option>Acinetobacter baumannii (CRAB)</option>
                <option>Pseudomonas aeruginosa (MDR)</option>
                <option>Klebsiella pneumoniae (KPC)</option>
                <option>Staphylococcus aureus (MRSA)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase font-bold">Antibiotic</label>
              <select 
                value={antibiotic}
                onChange={e => setAntibiotic(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:ring-blue-500 outline-none"
              >
                <option>Colistin</option>
                <option>Ceftazidime / Avibactam</option>
                <option>Meropenem</option>
                <option>Vancomycin</option>
              </select>
            </div>
            <button 
              onClick={() => runSimulation('sim')}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg flex justify-center items-center gap-2 transition"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Play className="w-4 h-4" />}
              Run Simulation
            </button>
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
          <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-teal-400" />
            Live Search Agent
          </h3>
          <textarea 
            value={customQuery}
            onChange={e => setCustomQuery(e.target.value)}
            placeholder="Query latest clinical literature..."
            className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 mb-3 resize-none focus:outline-none focus:border-teal-500"
          ></textarea>
          <button 
            onClick={() => runSimulation('agent')}
            disabled={loading || !customQuery}
            className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg flex justify-center items-center gap-2 transition"
          >
             {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <TerminalSquare className="w-4 h-4" />}
            Query Agent
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="w-full lg:w-2/3 bg-[#0a0f18] rounded-xl border border-slate-800 p-4 flex flex-col shadow-2xl h-[550px]">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-xs font-mono text-slate-500">LAB_TERMINAL ~ Vahhab Piranfar (Nathan)</span>
        </div>
        
        <div className="flex-1 overflow-y-auto font-mono text-sm space-y-3 pr-2 custom-scrollbar">
          {output.map((line, i) => (
            <div key={i} className={`
              ${line.type === 'system' ? 'text-slate-500' : ''}
              ${line.type === 'action' ? 'text-blue-400' : ''}
              ${line.type === 'result' ? 'text-teal-300 whitespace-pre-wrap pl-4 border-l-2 border-teal-800' : ''}
              ${line.type === 'error' ? 'text-red-400 bg-red-950/30 p-2 rounded' : ''}
            `}>
              {line.text}
            </div>
          ))}
          {loading && (
             <div className="text-yellow-400 animate-pulse">&gt; Processing... awaiting LLM response...</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ArticlesView() {
  const articles = [
    {
      type: "Article",
      title: "Utilizing Agentic LLMs for Real-Time Pathogen Tracking",
      date: "Spring 2026",
      desc: "A comprehensive look at how connecting Ollama models via SerpAPI (ollama_web_search.py) bypasses the knowledge cut-off limits of traditional LLMs in rapidly evolving hospital outbreaks."
    },
    {
      type: "Code Solution",
      title: "Automated Microscopic Image Parsing to FASTA",
      date: "Integration Framework",
      desc: "Proposed architectural solution linking Computer Vision (counting rod-shaped bacilli) directly to expected genomic outputs, bridging physical microscopy with digital genomics."
    },
    {
      type: "Research Note",
      title: "Mapping KPC Resistance to Colistin in K. pneumoniae",
      date: "Bioinformatics Log",
      desc: "Observations from the CARD database indicating novel efflux pump mutations. Simulated validation pending via AlphaFold 3 structural analysis."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
      {articles.map((art, idx) => (
        <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-500 transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-3">
            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider border border-blue-500/30">
              {art.type}
            </span>
            <span className="text-slate-500 text-xs">{art.date}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-200 mb-2 group-hover:text-blue-400 transition-colors">
            {art.title}
          </h3>
          <p className="text-slate-400 text-sm">
            {art.desc}
          </p>
          <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            <BookOpen className="w-4 h-4" /> Read Document
          </div>
        </div>
      ))}
    </div>
  );
}