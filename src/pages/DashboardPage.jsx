/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, History, MessageSquare, Heart, Settings, TrendingUp, ScanBarcode, Edit3, ArrowDownToLine, BellRing, ChevronRight } from "lucide-react";
import "../dashboard.css";

const MOCK_STATS = [
  { label: "Total Scans", val: "12", icon: ScanBarcode },
  { label: "Reviews Written", val: "2", icon: Edit3 },
  { label: "Wishlist Items", val: "4", icon: Heart },
  { label: "Helpful Upvotes", val: "7", icon: TrendingUp },
];

const RECENT_SCANS = [
  { id: 1, name: "Dove Deep Moisture 500ml", date: "Today, 10:42 AM", emoji: "🧴" },
  { id: 2, name: "Amul Taaza Milk 1L", date: "Yesterday, 4:15 PM", emoji: "🥛" },
  { id: 3, name: "Nivea Body Milk 500ml", date: "Oct 22, 11:30 AM", emoji: "🌿" },
  { id: 4, name: "Parle-G 100g", date: "Oct 21, 09:20 AM", emoji: "🍪" },
  { id: 5, name: "Tropicana Apple Juice", date: "Oct 19, 2:10 PM", emoji: "🧃" },
  { id: 6, name: "Maggi 2-Min Noodles", date: "Oct 18, 5:45 PM", emoji: "🍜" },
];

const PRICE_ALERTS = [
  { id: 1, name: "Dabur Honey 500g", emoji: "🍯", old: 199, new: 175 },
  { id: 2, name: "Tata Salt 1kg", emoji: "🧂", old: 28, new: 24 },
  { id: 3, name: "Surf Excel 1kg", emoji: "👕", old: 125, new: 105 },
];

// eslint-disable-next-line react/prop-types
export default function DashboardPage({ onBack }) {
  const [activeNav, setActiveNav] = useState("Overview");

  const NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "My Scans", icon: History },
    { label: "My Reviews", icon: MessageSquare },
    { label: "Wishlist", icon: Heart },
    { label: "Settings", icon: Settings },
  ];

  const variants = {
    hidden: { opacity: 0, y: 20 },
    show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }})
  };

  return (
    <div className="db-page">
      
      {/* Sidebar */}
      <div className="db-sidebar">
        <div className="db-user-avatar">
          <div className="db-avatar-circ">S</div>
          <div className="db-user-info-sb">
            <h3>Surbhi</h3>
            <span>Beta Tester</span>
          </div>
        </div>
        
        <div className="db-nav-links">
          {NAV_ITEMS.map((nav) => {
            const Icon = nav.icon;
            return (
              <div 
                key={nav.label} 
                className={`db-nav-item ${activeNav === nav.label ? 'active' : ''}`}
                onClick={() => setActiveNav(nav.label)}
              >
                <Icon size={18} /> {nav.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="db-main">
        
        {/* OVERVIEW TAB */}
        {activeNav === "Overview" && (
          <motion.div key="overview" initial="hidden" animate="show" exit="hidden">
            <motion.div className="db-header" custom={0} variants={variants}>
              <div className="db-title">Welcome back, Surbhi!</div>
              <div style={{ color: "var(--dash-text-muted)", marginTop: 8 }}>Here is what's happening with your scanned products.</div>
            </motion.div>

            {/* Top Stats */}
            <div className="db-stats-row">
              {MOCK_STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={i} className="db-stat-card" custom={i + 1} variants={variants}>
                    <div className="db-stat-top">
                      <div className="db-stat-icon"><Icon size={20} /></div>
                    </div>
                    <div>
                      <div className="db-stat-lbl">{stat.label}</div>
                      <div className="db-stat-val">{stat.val}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Content Grid */}
            <div className="db-content-grid">
              
              {/* Recent Scans */}
              <motion.div custom={5} variants={variants}>
                <div className="db-section-title"><History size={20} color="var(--dash-amber)"/> Recent Scans</div>
                <div className="db-scans-grid">
                  {RECENT_SCANS.map((scan) => (
                    <div key={scan.id} className="db-scan-card">
                      <div className="db-sc-emoji">{scan.emoji}</div>
                      <div className="db-sc-info">
                        <div className="db-sc-date">{scan.date}</div>
                        <div className="db-sc-name">{scan.name}</div>
                        <button className="db-btn-compare">
                          Compare <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Widgets */}
              <motion.div custom={6} variants={variants}>
                <div className="db-section-title"><BellRing size={20} color="var(--dash-amber)"/> Price Drops</div>
                <div className="db-widget">
                  {PRICE_ALERTS.map(alert => (
                    <div key={alert.id} className="db-alert-item">
                      <div className="db-al-icon">{alert.emoji}</div>
                      <div>
                        <div className="db-al-title">{alert.name}</div>
                        <div className="db-al-prices">
                          <span className="db-al-old">₹{alert.old}</span>
                          <ArrowDownToLine size={12} color="#00ffaa" />
                          <span className="db-al-new">₹{alert.new}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}

        {/* MY SCANS TAB */}
        {activeNav === "My Scans" && (
          <motion.div key="myscans" initial="hidden" animate="show" custom={0} variants={variants}>
            <div className="db-header">
              <div className="db-title">My Scans History</div>
              <div style={{ color: "var(--dash-text-muted)", marginTop: 8 }}>A detailed log of all products you've scanned.</div>
            </div>
            <div className="db-scans-grid" style={{ marginTop: 24, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
              {RECENT_SCANS.map((scan) => (
                <div key={scan.id} className="db-scan-card" style={{ marginBottom: 12 }}>
                  <div className="db-sc-emoji">{scan.emoji}</div>
                  <div className="db-sc-info">
                    <div className="db-sc-date">{scan.date}</div>
                    <div className="db-sc-name">{scan.name}</div>
                    <button className="db-btn-compare">
                      Compare <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* MY REVIEWS TAB */}
        {activeNav === "My Reviews" && (
          <motion.div key="myreviews" initial="hidden" animate="show" custom={0} variants={variants}>
            <div className="db-header">
              <div className="db-title">My Reviews</div>
              <div style={{ color: "var(--dash-text-muted)", marginTop: 8 }}>Your contributions to the Cartico community.</div>
            </div>
            <div className="db-widget" style={{ marginTop: 24, padding: "64px 32px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
               <MessageSquare size={48} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 16px" }} />
               <div style={{ fontSize: 18, fontWeight: 600 }}>No reviews yet</div>
               <div style={{ color: "var(--dash-text-muted)", marginTop: 8 }}>Start reviewing products you've scanned to help others!</div>
            </div>
          </motion.div>
        )}

        {/* WISHLIST TAB */}
        {activeNav === "Wishlist" && (
          <motion.div key="wishlist" initial="hidden" animate="show" custom={0} variants={variants}>
            <div className="db-header">
              <div className="db-title">My Wishlist</div>
              <div style={{ color: "var(--dash-text-muted)", marginTop: 8 }}>Products you're keeping an eye on.</div>
            </div>
            <div className="db-widget" style={{ marginTop: 24, padding: "64px 32px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
               <Heart size={48} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 16px" }} />
               <div style={{ fontSize: 18, fontWeight: 600 }}>Your wishlist is empty</div>
               <div style={{ color: "var(--dash-text-muted)", marginTop: 8 }}>Add products here to track their price drops.</div>
            </div>
          </motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeNav === "Settings" && (
          <motion.div key="settings" initial="hidden" animate="show" custom={0} variants={variants}>
            <div className="db-header">
              <div className="db-title">Account Settings</div>
              <div style={{ color: "var(--dash-text-muted)", marginTop: 8 }}>Manage your preferences and alerts.</div>
            </div>
            <div className="db-widget" style={{ marginTop: 24, padding: 24 }}>
               {['Email Notifications', 'Push Alerts for Price Drops', 'Beta Analytics Features', 'Strict Dark Mode Enforced'].map((st, i) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i === 3 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                   <div style={{ fontSize: 14, fontWeight: 500 }}>{st}</div>
                   <div style={{ width: 44, height: 24, background: i < 2 ? 'var(--dash-amber)' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', borderRadius: 12, position: 'relative', transition: 'all 0.3s' }}>
                     <div style={{ width: 18, height: 18, background: i < 2 ? '#fff' : 'rgba(255,255,255,0.4)', borderRadius: '50%', position: 'absolute', top: 2, left: i < 2 ? 22 : 2, transition: 'all 0.3s' }} />
                   </div>
                 </div>
               ))}
               <button className="db-buy-btn" style={{ marginTop: 32, width: "100%", padding: 14, background: "rgba(255,79,109,0.1)", color: "#ff7a92", border: "1px solid rgba(255,79,109,0.2)", borderRadius: 12, cursor: "pointer", fontWeight: 600 }}>
                 Sign Out
               </button>
            </div>
          </motion.div>
        )}

      </div>
      
    </div>
  );
}
