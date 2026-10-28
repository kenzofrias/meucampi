import React, { useState } from 'react';
import { X, GraduationCap, CheckCircle2 } from 'lucide-react';
import { UniversityProfile } from '../types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UniversityProfile;
  onSaveProfile: (profile: UniversityProfile) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  const [universityName, setUniversityName] = useState(profile.universityName);
  const [courseName, setCourseName] = useState(profile.courseName);
  const [currentSemesterOrdinal, setCurrentSemesterOrdinal] = useState(profile.currentSemesterOrdinal);
  const [activePeriod, setActivePeriod] = useState(profile.activePeriod);
  const [studentName, setStudentName] = useState(profile.studentName || '');
  const [registrationNumber, setRegistrationNumber] = useState(profile.registrationNumber || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!universityName.trim() || !courseName.trim()) return;

    onSaveProfile({
      universityName: universityName.trim(),
      courseName: courseName.trim(),
      currentSemesterOrdinal: currentSemesterOrdinal.trim(),
      activePeriod: activePeriod.trim(),
      studentName: studentName.trim() || undefined,
      registrationNumber: registrationNumber.trim() || undefined,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Minha Realidade Universitária
              </h2>
              <p className="text-xs text-slate-500">
                Configure sua universidade, curso e período letivo em curso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Universidade */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Nome da Universidade ou Faculdade *
            </label>
            <input
              type="text"
              required
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              placeholder="Ex: Universidade Estadual de Campinas (UNICAMP) ou USP"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-slate-900 font-medium"
            />
          </div>

          {/* Curso */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Curso de Graduação ou Pós *
            </label>
            <input
              type="text"
              required
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Ex: Ciência da Computação ou Engenharia Civil"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-slate-900 font-medium"
            />
          </div>

          {/* Semestre Ordinal e Período Vigente */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Semestre Atual *
              </label>
              <input
                type="text"
                required
                value={currentSemesterOrdinal}
                onChange={(e) => setCurrentSemesterOrdinal(e.target.value)}
                placeholder="Ex: 6º Semestre"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Período Letivo Vigente *
              </label>
              <input
                type="text"
                required
                value={activePeriod}
                onChange={(e) => setActivePeriod(e.target.value)}
                placeholder="Ex: 2026.2 ou 2026.1"
                className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-indigo-700"
              />
            </div>
          </div>

          {/* Identificação Opcional: Nome e RA */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nome do Estudante (Opcional)
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Ex: Kenzo Frias"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Registro Acadêmico / RA (Opcional)
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="Ex: 202310842-SP"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Realidade Universitária atualizada com sucesso!</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              Salvar Realidade
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
