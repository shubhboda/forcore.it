import { useState } from "react";
import { ExternalLink, X, Linkedin, Github, Mail } from "lucide-react";
import { teamMembers } from "../data/team";

export default function Team() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <section id="team" className="py-24 px-6 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold text-white mb-4">
            Meet the Team
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Student founders building world-class software from India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl p-6 bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  {member.photoFallback === null ? (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/30 flex items-center justify-center">
                      <span className="text-2xl font-bold text-cyan-400">NC</span>
                    </div>
                  ) : (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover border-2 border-white/10"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = member.photoFallback || "";
                      }}
                    />
                  )}
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-cyan-400 text-sm mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{member.bio}</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {member.skills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-gray-400">
                      {skill}
                    </span>
                  ))}
                </div>
                {member.stats && <p className="text-xs text-gray-500 mb-4">{member.stats}</p>}
                {member.portfolio && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(member.portfolio, "_blank");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/30"
                  >
                    View Portfolio
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="relative max-w-lg w-full rounded-2xl bg-[#0d0d1a] border border-white/10 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              {selectedMember.photoFallback === null ? (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/30 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-cyan-400">NC</span>
                </div>
              ) : (
                <img
                  src={selectedMember.photo}
                  alt={selectedMember.name}
                  className="w-28 h-28 rounded-full object-cover border-2 border-cyan-400/30 mb-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = selectedMember.photoFallback || "";
                  }}
                />
              )}
              <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-white">{selectedMember.name}</h3>
              <p className="text-cyan-400 mb-4">{selectedMember.role}</p>
              <p className="text-gray-400 text-sm mb-6">{selectedMember.bio}</p>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {selectedMember.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-sm bg-white/5 text-gray-400">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {selectedMember.portfolio && (
                  <a
                    href={selectedMember.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400"
                  >
                    Open Full CV
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {selectedMember.linkedin && selectedMember.linkedin !== "#" && (
                  <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-cyan-400">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {selectedMember.github && selectedMember.github !== "#" && (
                  <a href={selectedMember.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-cyan-400">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {selectedMember.email && (
                  <a href={`mailto:${selectedMember.email}`} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-cyan-400">
                    <Mail className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
