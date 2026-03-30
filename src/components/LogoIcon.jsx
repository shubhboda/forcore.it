export default function LogoIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="30,80 50,90 50,60 30,50" fill="#0C204B" />
      <polygon points="50,90 70,80 70,50 50,60" fill="#142C67" />
      <polygon points="30,50 50,60 70,50 50,40" fill="#3D87F5" />
      <line x1="50" y1="50" x2="80" y2="30" stroke="#3D87F5" strokeWidth="6" strokeLinecap="round" />
      <circle cx="85" cy="27" r="7" stroke="#3D87F5" strokeWidth="5" fill="none" />
    </svg>
  );
}
