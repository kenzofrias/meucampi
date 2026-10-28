import React, { useState, useEffect, useMemo } from 'react';
import {
  UniversityProfile,
  DocumentItem,
  Discipline,
  AcademicScope,
  ACADEMIC_SCOPES,
} from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { SemesterTabs } from './components/SemesterTabs';
import { SearchAndChips } from './components/SearchAndChips';
import { DocumentCard } from './components/DocumentCard';
import { FloatingActionButton } from './components/FloatingActionButton';
import { DocumentFormModal } from './components/DocumentFormModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { DisciplinesModal } from './components/DisciplinesModal';
import { TrashModal } from './components/TrashModal';
import {
  FileText,
  Plus,
  BookOpen,
  FolderOpen,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // State from Storage Service
  const [profile, setProfile] = useState<UniversityProfile>(() => storageService.getProfile());
  const [documents, setDocuments] = useState<DocumentItem[]>(() => storageService.getDocuments());
  const [disciplines, setDisciplines] = useState<Discipline[]>(() => storageService.getDisciplines());

  // Filter States
  const [activeSemester, setActiveSemester] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScope, setSelectedScope] = useState<AcademicScope | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string | null>(null);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<DocumentItem | null>(null);
  const [previewingDocument, setPreviewingDocument] = useState<DocumentItem | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDisciplinesModalOpen, setIsDisciplinesModalOpen] = useState(false);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);

  // Active (non-deleted) and deleted documents
  const activeDocuments = useMemo(() => documents.filter((d) => !d.isDeleted), [documents]);
  const trashDocuments = useMemo(() => documents.filter((d) => d.isDeleted), [documents]);

  // Dynamic available semesters list (based on profile active period + docs)
  const availableSemesters = useMemo(() => {
    const s = new Set<string>();
    if (profile.activePeriod) s.add(profile.activePeriod);
    s.add('2026.2');
    s.add('2026.1');
    s.add('2025.2');
    s.add('2025.1');
    s.add('Permanente');
    activeDocuments.forEach((d) => {
      if (d.semester) s.add(d.semester);
    });
    return Array.from(s);
  }, [profile.activePeriod, activeDocuments]);

  // Semester Counts
  const semesterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: activeDocuments.length };
    availableSemesters.forEach((sem) => {
      counts[sem] = 0;
    });
    activeDocuments.forEach((doc) => {
      if (counts[doc.semester] !== undefined) {
        counts[doc.semester]++;
      } else {
        counts[doc.semester] = 1;
      }
    });
    return counts;
  }, [activeDocuments, availableSemesters]);

  // Unique available tags from active documents
  const allAvailableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    activeDocuments.forEach((d) => {
      d.tags.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [activeDocuments]);

  // Filtered documents for the Feed
  const filteredDocuments = useMemo(() => {
    return activeDocuments.filter((doc) => {
      // Semester filter
      if (activeSemester !== 'all' && doc.semester !== activeSemester) {
        return false;
      }

      // Scope filter
      if (selectedScope !== 'all' && doc.scope !== selectedScope) {
        return false;
      }

      // Discipline filter
      if (selectedDisciplineId && doc.disciplineId !== selectedDisciplineId) {
        return false;
      }

      // Tag filter
      if (selectedTag && !doc.tags.includes(selectedTag)) {
        return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchDesc = doc.description?.toLowerCase().includes(q) || false;
        const matchDisc = doc.disciplineName?.toLowerCase().includes(q) || false;
        const matchProf = doc.professorName?.toLowerCase().includes(q) || false;
        const matchCode = doc.verificationCode?.toLowerCase().includes(q) || false;
        const matchTag = doc.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchTitle && !matchDesc && !matchDisc && !matchProf && !matchCode && !matchTag) {
          return false;
        }
      }

      return true;
    });
  }, [
    activeDocuments,
    activeSemester,
    selectedScope,
    selectedDisciplineId,
    selectedTag,
    searchQuery,
  ]);

  // HANDLERS
  const handleSaveProfile = (newProfile: UniversityProfile) => {
    storageService.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const handleCreateDocument = (
    docData: Omit<DocumentItem, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>
  ) => {
    const created = storageService.addDocument(docData);
    setDocuments(storageService.getDocuments());
    // Auto select semester if needed
    if (activeSemester !== 'all' && activeSemester !== created.semester) {
      setActiveSemester(created.semester);
    }
  };

  const handleUpdateDocument = (id: string, updates: Partial<DocumentItem>) => {
    storageService.updateDocument(id, updates);
    setDocuments(storageService.getDocuments());
    if (previewingDocument && previewingDocument.id === id) {
      setPreviewingDocument((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleMoveToTrash = (id: string) => {
    storageService.moveDocumentToTrash(id);
    setDocuments(storageService.getDocuments());
  };

  const handleRestoreDocument = (id: string) => {
    storageService.restoreDocument(id);
    setDocuments(storageService.getDocuments());
  };

  const handlePermanentDelete = (id: string) => {
    storageService.permanentlyDeleteDocument(id);
    setDocuments(storageService.getDocuments());
  };

  const handleEmptyTrash = () => {
    storageService.emptyTrash();
    setDocuments(storageService.getDocuments());
  };

  const handleAddDiscipline = (name: string, professor: string, semester: string) => {
    storageService.addDiscipline({
      name,
      professorName: professor,
      semester,
    });
    setDisciplines(storageService.getDisciplines());
  };

  const handleDeleteDiscipline = (id: string) => {
    storageService.deleteDiscipline(id);
    setDisciplines(storageService.getDisciplines());
    if (selectedDisciplineId === id) setSelectedDisciplineId(null);
  };

  const handleQuickAddDiscipline = (name: string, professor: string): Discipline => {
    const created = storageService.addDiscipline({
      name,
      professorName: professor,
      semester: profile.activePeriod || '2026.2',
    });
    setDisciplines(storageService.getDisciplines());
    return created;
  };

  const handleClearAllFilters = () => {
    setActiveSemester('all');
    setSelectedScope('all');
    setSelectedTag(null);
    setSelectedDisciplineId(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. Header with Realidade Universitária */}
      <Header
        profile={profile}
        trashCount={trashDocuments.length}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenDisciplinesModal={() => setIsDisciplinesModalOpen(true)}
        onOpenTrashModal={() => setIsTrashModalOpen(true)}
        onOpenNewDocumentModal={() => {
          setDocumentToEdit(null);
          setIsFormModalOpen(true);
        }}
      />

      {/* 2. Dashboard por Semestres em Abas Horizontais */}
      <SemesterTabs
        semesters={availableSemesters}
        activeSemester={activeSemester}
        onSelectSemester={setActiveSemester}
        semesterCounts={semesterCounts}
        activePeriod={profile.activePeriod}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Realidade Overview Sub-Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-0.5">
              <GraduationCap className="w-4 h-4 text-slate-700" />
              <span>{profile.universityName}</span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-indigo-700 font-bold">{profile.activePeriod}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              {profile.courseName} · {profile.currentSemesterOrdinal}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Organizador centralizado de comprovantes, históricos, apostilas de aula e certificados.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              Editar Realidade
            </button>
            <button
              onClick={() => setIsDisciplinesModalOpen(true)}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Mapear Disciplinas ({disciplines.length})
            </button>
          </div>
        </div>

        {/* 3. Barra de Pesquisa Global com Chips de Filtro */}
        <SearchAndChips
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedScope={selectedScope}
          onSelectScope={setSelectedScope}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          allAvailableTags={allAvailableTags}
          totalResults={filteredDocuments.length}
          onClearAllFilters={handleClearAllFilters}
          selectedDisciplineId={selectedDisciplineId}
          onSelectDisciplineId={setSelectedDisciplineId}
          disciplinesList={disciplines.map((d) => ({ id: d.id, name: d.name }))}
        />

        {/* 4. Feed de Cards com Badges Coloridos */}
        {filteredDocuments.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Nenhum documento encontrado
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Não encontramos arquivos correspondentes aos filtros aplicados. Tente limpar os filtros ou faça upload de um novo documento.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={handleClearAllFilters}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Limpar Todos os Filtros
              </button>
              <button
                onClick={() => {
                  setDocumentToEdit(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
              >
                + Adicionar Documento
              </button>
            </div>
          </div>
        ) : (
          /* Responsive Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onPreview={(d) => setPreviewingDocument(d)}
                onEdit={(d) => {
                  setDocumentToEdit(d);
                  setIsFormModalOpen(true);
                }}
                onDelete={handleMoveToTrash}
                onTagClick={(tag) => setSelectedTag(tag === selectedTag ? null : tag)}
              />
            ))}
          </div>
        )}

      </main>

      {/* 5. Botão Flutuante (FAB) de Upload Rápido */}
      <FloatingActionButton
        onClick={() => {
          setDocumentToEdit(null);
          setIsFormModalOpen(true);
        }}
      />

      {/* MODALS */}

      {/* Formulário Modal de Preenchimento Progressivo */}
      <DocumentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setDocumentToEdit(null);
        }}
        onSave={handleCreateDocument}
        onUpdate={handleUpdateDocument}
        documentToEdit={documentToEdit}
        disciplines={disciplines}
        defaultSemester={profile.activePeriod || '2026.2'}
        onQuickAddDiscipline={handleQuickAddDiscipline}
      />

      {/* Visualização de Documento & Metadados */}
      <DocumentPreviewModal
        document={previewingDocument}
        onClose={() => setPreviewingDocument(null)}
        onEdit={(doc) => {
          setDocumentToEdit(doc);
          setIsFormModalOpen(true);
        }}
        onDelete={handleMoveToTrash}
      />

      {/* Cadastro & Edição de Realidade Universitária */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Mapeamento de Disciplinas & Professores */}
      <DisciplinesModal
        isOpen={isDisciplinesModalOpen}
        onClose={() => setIsDisciplinesModalOpen(false)}
        disciplines={disciplines}
        onAddDiscipline={handleAddDiscipline}
        onDeleteDiscipline={handleDeleteDiscipline}
        documents={activeDocuments}
        onSelectDisciplineFilter={(id) => setSelectedDisciplineId(id)}
        currentSemester={profile.activePeriod || '2026.2'}
      />

      {/* Lixeira com 30 dias de Retenção */}
      <TrashModal
        isOpen={isTrashModalOpen}
        onClose={() => setIsTrashModalOpen(false)}
        trashDocuments={trashDocuments}
        onRestore={handleRestoreDocument}
        onPermanentDelete={handlePermanentDelete}
        onEmptyTrash={handleEmptyTrash}
      />

    </div>
  );
}
