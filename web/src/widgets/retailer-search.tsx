import "@/index.css";

import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";

function RetailerSearch() {
  const { input, output } = useToolInfo<"retailer-search">();
  
  if (!output) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <span>Searching retailers for "{input?.productGroup}"...</span>
        </div>
      </div>
    );
  }

  const { retailers, productGroup, page, count } = output;

  return (
    <div className="container">
      <div className="header">
        <div className="header-info">
          <h2 className="title">Retailer Search Results</h2>
          <span className="subtitle">Product Group: <strong>{productGroup}</strong></span>
        </div>
        <div className="meta">
          <span className="badge">{count} results</span>
          <span className="page-info">Page {page}</span>
        </div>
      </div>
      
      {retailers.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>No retailers found for "{productGroup}"</p>
          <p className="hint">Try a different product group</p>
        </div>
      ) : (
        <div className="retailers-list">
          {retailers.map((retailer, index) => (
            <div key={index} className="retailer-card">
              <div className="retailer-header">
                <h3 className="retailer-name">
                  {retailer.english_name || retailer.name}
                </h3>
                {retailer.english_name && retailer.name !== retailer.english_name && (
                  <span className="retailer-local-name">{retailer.name}</span>
                )}
              </div>
              
              <div className="retailer-details">
                <div className="detail-row">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{retailer.category.product}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Country</span>
                  <span className="detail-value">{retailer.country}</span>
                </div>
                
                {retailer.contact && (
                  <div className="contact-section">
                    {retailer.contact.website && (
                      <a href={retailer.contact.website} target="_blank" rel="noopener noreferrer" className="contact-link">
                        🌐 Website
                      </a>
                    )}
                    {retailer.contact.email && (
                      <a href={`mailto:${retailer.contact.email}`} className="contact-link">
                        ✉️ {retailer.contact.email}
                      </a>
                    )}
                    {retailer.contact.phone && (
                      <span className="contact-link">📞 {retailer.contact.phone}</span>
                    )}
                  </div>
                )}
                
                {retailer.exhibition && retailer.exhibition.length > 0 && (
                  <div className="exhibitions">
                    <span className="detail-label">Exhibitions</span>
                    <div className="exhibition-tags">
                      {retailer.exhibition.map((ex, i) => (
                        <span key={i} className="exhibition-tag">
                          {ex.name} {ex.boothNumber && `(${ex.boothNumber})`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style>{`
        .container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 16px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 12px;
          color: #fff;
          max-width: 700px;
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
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #ffffff1a;
        }
        .header-info {
          flex: 1;
        }
        .title {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #c5a059;
        }
        .subtitle {
          font-size: 13px;
          color: #a0a0a0;
        }
        .subtitle strong {
          color: #e0e0e0;
        }
        .meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        .badge {
          background: #c5a05922;
          color: #c5a059;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .page-info {
          font-size: 11px;
          color: #808080;
        }
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #808080;
        }
        .empty-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }
        .hint {
          font-size: 12px;
          color: #606060;
        }
        .retailers-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .retailer-card {
          background: #ffffff08;
          border: 1px solid #ffffff12;
          border-radius: 10px;
          padding: 16px;
          transition: all 0.2s ease;
        }
        .retailer-card:hover {
          background: #ffffff0d;
          border-color: #c5a05930;
        }
        .retailer-header {
          margin-bottom: 12px;
        }
        .retailer-name {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }
        .retailer-local-name {
          display: block;
          font-size: 12px;
          color: #808080;
          margin-top: 2px;
        }
        .retailer-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
        .detail-label {
          color: #808080;
        }
        .detail-value {
          color: #c0c0c0;
        }
        .contact-section {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #ffffff10;
        }
        .contact-link {
          font-size: 12px;
          color: #c5a059;
          text-decoration: none;
          background: #c5a05915;
          padding: 4px 10px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .contact-link:hover {
          background: #c5a05925;
        }
        .exhibitions {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #ffffff10;
        }
        .exhibition-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
        }
        .exhibition-tag {
          font-size: 11px;
          background: #4a90d915;
          color: #6ab0ff;
          padding: 3px 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

export default RetailerSearch;

mountWidget(<RetailerSearch />);
