import { useState, useRef } from "react";
import axios from "axios";

const HeartbeatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <polyline points="2,12 6,12 8,4 10,20 13,10 15,14 17,12 22,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ScanIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 9V5a2 2 0 012-2h4M3 15v4a2 2 0 002 2h4M21 9V5a2 2 0 00-2-2h-4M21 15v4a2 2 0 01-2 2h-4M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WarnIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ResetIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handlePredict = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await axios.post("http://localhost:5000/api/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch {
      setError("Connection error. Please ensure all servers are running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const isPneumonia = result?.result === "PNEUMONIA";

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f0", fontFamily: "'Georgia', serif" }}>

      {/* Top status bar */}
      <div style={{ background: "#1a4a2e", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#a8d5b5" }}>
          <HeartbeatIcon />
          <span style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "monospace" }}>
            PneumoDetect AI &nbsp;•&nbsp; Radiology Assistance System
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4caf7d" }}></div>
          <span style={{ fontSize: "10px", color: "#a8d5b5", fontFamily: "monospace", letterSpacing: "1px" }}>SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #d4e8da", padding: "1.25rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "52px", height: "52px", background: "#1a4a2e", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8 2 5 5.5 5 9c0 2.5 1 4.5 2.5 6L12 22l4.5-7C18 13.5 19 11.5 19 9c0-3.5-3-7-7-7z" stroke="#a8d5b5" strokeWidth="1.5"/>
              <path d="M9 9c0-1.66 1.34-3 3-3s3 1.34 3 3" stroke="#4caf7d" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1a4a2e", margin: 0, letterSpacing: "-0.5px" }}>
              PneumoDetect AI
            </h1>
            <p style={{ fontSize: "12px", color: "#5a8a6a", margin: "2px 0 0", fontFamily: "monospace", letterSpacing: "0.5px" }}>
              AI-Powered Chest X-Ray Pneumonia Detection
            </p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: "10px", color: "#5a8a6a", fontFamily: "monospace", letterSpacing: "1px" }}>MODEL</div>
            <div style={{ fontSize: "12px", color: "#1a4a2e", fontWeight: "600", fontFamily: "monospace" }}>Transfer Learning v1.0</div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>

        {/* Upload + Preview Grid */}
        <div style={{ display: "grid", gridTemplateColumns: preview ? "1fr 1fr" : "1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>

          {/* Upload Card */}
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #d4e8da", overflow: "hidden" }}>
            <div style={{ background: "#f5faf6", borderBottom: "1px solid #d4e8da", padding: "0.85rem 1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4caf7d" }}></div>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ffc107" }}></div>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef5350" }}></div>
              <span style={{ fontSize: "11px", color: "#5a8a6a", fontFamily: "monospace", marginLeft: "8px", letterSpacing: "1px" }}>UPLOAD X-RAY IMAGE</span>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div
                onClick={() => fileInputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                style={{
                  border: `2px dashed ${dragOver ? "#1a4a2e" : "#a8d5b5"}`,
                  borderRadius: "12px",
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: dragOver ? "#f0f7f2" : "#fafcfb",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ color: "#4caf7d", marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
                  <UploadIcon />
                </div>
                <p style={{ fontSize: "14px", color: "#1a4a2e", fontWeight: "600", margin: "0 0 6px" }}>
                  Drop X-Ray image here
                </p>
                <p style={{ fontSize: "12px", color: "#5a8a6a", margin: "0 0 1rem", fontFamily: "monospace" }}>
                  or click to browse files
                </p>
                <span style={{ fontSize: "11px", color: "#a8d5b5", background: "#f0f7f2", padding: "4px 12px", borderRadius: "20px", fontFamily: "monospace" }}>
                  PNG • JPG • JPEG
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />

              {image && (
                <div style={{ marginTop: "1rem", padding: "10px 14px", background: "#f0f7f2", borderRadius: "8px", border: "1px solid #d4e8da" }}>
                  <p style={{ fontSize: "11px", color: "#1a4a2e", margin: 0, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    ✓ &nbsp;{image.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Preview Card */}
          {preview && (
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #d4e8da", overflow: "hidden" }}>
              <div style={{ background: "#f5faf6", borderBottom: "1px solid #d4e8da", padding: "0.85rem 1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <ScanIcon />
                <span style={{ fontSize: "11px", color: "#5a8a6a", fontFamily: "monospace", letterSpacing: "1px" }}>RADIOGRAPH PREVIEW</span>
              </div>
              <div style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d1f14", minHeight: "240px" }}>
                <img
                  src={preview}
                  alt="X-Ray Preview"
                  style={{ maxHeight: "240px", maxWidth: "100%", objectFit: "contain", borderRadius: "4px" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "1.5rem" }}>
          <button
            onClick={handlePredict}
            disabled={!image || loading}
            style={{
              flex: 1,
              background: !image || loading ? "#c8dece" : "#1a4a2e",
              color: !image || loading ? "#8ab89a" : "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "1rem",
              fontSize: "15px",
              fontWeight: "600",
              cursor: !image || loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s",
              letterSpacing: "0.3px",
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: "18px", height: "18px",
                  border: "2px solid #8ab89a",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }}></div>
                Analyzing Radiograph...
              </>
            ) : (
              <>
                <ScanIcon />
                Run AI Diagnosis
              </>
            )}
          </button>

          {image && (
            <button
              onClick={handleReset}
              style={{
                background: "#fff",
                color: "#1a4a2e",
                border: "1px solid #d4e8da",
                borderRadius: "12px",
                padding: "1rem 1.25rem",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ResetIcon />
              Reset
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #ffcdd2", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#c62828", fontSize: "16px" }}>✕</span>
            <p style={{ color: "#c62828", margin: 0, fontSize: "13px", fontFamily: "monospace" }}>{error}</p>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div style={{ background: "#fff", borderRadius: "16px", border: `1px solid ${isPneumonia ? "#ffcdd2" : "#d4e8da"}`, overflow: "hidden", marginBottom: "1.5rem" }}>

            {/* Result Header */}
            <div style={{ background: isPneumonia ? "#c62828" : "#1a4a2e", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ color: "#fff" }}>
                  {isPneumonia ? <WarnIcon /> : <CheckIcon />}
                </div>
                <div>
                  <p style={{ fontSize: "10px", color: isPneumonia ? "#ffcdd2" : "#a8d5b5", margin: "0 0 4px", fontFamily: "monospace", letterSpacing: "2px" }}>
                    DIAGNOSIS RESULT
                  </p>
                  <p style={{ fontSize: "22px", fontWeight: "700", color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
                    {isPneumonia ? "Pneumonia Detected" : "No Pneumonia Found"}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "10px", color: isPneumonia ? "#ffcdd2" : "#a8d5b5", margin: "0 0 2px", fontFamily: "monospace", letterSpacing: "1px" }}>
                  CONFIDENCE
                </p>
                <p style={{ fontSize: "30px", fontWeight: "700", color: "#fff", margin: 0, fontFamily: "monospace" }}>
                  {result.confidence}%
                </p>
              </div>
            </div>

            {/* Confidence Bar */}
            <div style={{ padding: "1rem 2rem", borderBottom: "1px solid #f0f4f0", background: "#fafcfb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "10px", color: "#5a8a6a", fontFamily: "monospace", letterSpacing: "1px" }}>CONFIDENCE LEVEL</span>
                <span style={{ fontSize: "10px", color: "#5a8a6a", fontFamily: "monospace" }}>{result.confidence}%</span>
              </div>
              <div style={{ height: "5px", background: "#e8f5ec", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${result.confidence}%`,
                  background: isPneumonia ? "#c62828" : "#1a4a2e",
                  borderRadius: "4px",
                  transition: "width 1.2s ease"
                }}></div>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ padding: "0.85rem 2rem", background: "#fffde7", borderBottom: "1px solid #fff9c4" }}>
              <p style={{ fontSize: "11px", color: "#7a6500", margin: 0, fontFamily: "monospace", lineHeight: "1.6" }}>
                ⚕ DISCLAIMER: This AI-assisted analysis does not replace professional medical diagnosis. Please consult a qualified radiologist or physician.
              </p>
            </div>

            {/* Normal Message */}
            {!isPneumonia && (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <div style={{ width: "56px", height: "56px", background: "#f0f7f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="#4caf7d" strokeWidth="1.5"/>
                  </svg>
                </div>
                <p style={{ color: "#1a4a2e", fontWeight: "600", fontSize: "15px", margin: "0 0 6px" }}>Lungs appear normal</p>
                <p style={{ color: "#5a8a6a", fontSize: "13px", margin: 0, fontFamily: "monospace" }}>No signs of pneumonia detected. Continue regular health checkups.</p>
              </div>
            )}

            {/* AI Suggestions */}
            {result.suggestions && (
              <div style={{ padding: "1.5rem 2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
                  <div style={{ width: "30px", height: "30px", background: "#1a4a2e", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1v14M1 8h14" stroke="#a8d5b5" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#1a4a2e", margin: 0 }}>Medical Advisory</p>
                    <p style={{ fontSize: "10px", color: "#5a8a6a", margin: 0, fontFamily: "monospace", letterSpacing: "0.5px" }}>AI-GENERATED • CONSULT A DOCTOR</p>
                  </div>
                </div>

                <div style={{ background: "#f5faf6", border: "1px solid #d4e8da", borderRadius: "12px", padding: "1.5rem" }}>
                  <pre style={{
                    whiteSpace: "pre-wrap",
                    fontSize: "13px",
                    color: "#1a3a22",
                    fontFamily: "monospace",
                    lineHeight: "2",
                    margin: 0,
                  }}>
                    {result.suggestions}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #d4e8da", padding: "1.25rem 2rem", textAlign: "center", background: "#fff" }}>
        <p style={{ fontSize: "11px", color: "#5a8a6a", margin: 0, fontFamily: "monospace", letterSpacing: "0.5px" }}>
          PneumoDetect AI — Built with React + Flask + Gemini AI &nbsp;•&nbsp; For Research & Educational Use Only
        </p>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        button:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
      `}</style>
    </div>
  );
}