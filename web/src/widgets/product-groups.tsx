import "@/index.css";

import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";

function ProductGroups() {
  const { output } = useToolInfo<"product-groups">();
  
  if (!output) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading product groups...</span>
        </div>
      </div>
    );
  }

  const { productGroups, count } = output;

  return (
    <div className="container">
      <div className="header">
        <h2 className="title">Product Groups</h2>
        <span className="badge">{count} categories</span>
      </div>
      <div className="groups-grid">
        {productGroups.map((group, index) => (
          <div key={index} className="group-card">
            <span className="group-name">{group}</span>
          </div>
        ))}
      </div>
      <style>{`
        .container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 16px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 12px;
          color: #fff;
          max-width: 600px;
        }
        .loading {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          color: #c5a059;
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #c5a05933;
          border-top-color: #c5a059;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #ffffff1a;
        }
        .title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #c5a059;
        }
        .badge {
          background: #c5a05922;
          color: #c5a059;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .groups-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 8px;
        }
        .group-card {
          background: #ffffff0a;
          border: 1px solid #ffffff15;
          border-radius: 8px;
          padding: 10px 14px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .group-card:hover {
          background: #c5a05915;
          border-color: #c5a05940;
          transform: translateY(-1px);
        }
        .group-name {
          font-size: 13px;
          color: #e0e0e0;
        }
      `}</style>
    </div>
  );
}

export default ProductGroups;

mountWidget(<ProductGroups />);
