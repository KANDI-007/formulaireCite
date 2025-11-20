import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send, SaveIcon, CheckCircle } from 'lucide-react';
import StepIndicator from './components/StepIndicator';
import PersonalInfoForm from './components/PersonalInfoForm';
import ProblemsForm from './components/ProblemsForm';
import ProgramsForm from './components/ProgramsForm';
import SummaryPreview from './components/SummaryPreview';
import LoadingScreen from './components/LoadingScreen';
import EventAnnouncement from './components/EventAnnouncement';
import { FormState } from './types/forms';
import { saveDraft, loadDraft, clearDraft, hasDraft } from './utils/localStorage';
import { supabase, isSupabaseConfigured } from './utils/supabaseClient';
import logo from './image/logo.png';

const initialState: FormState = {
  personalInfo: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    roomNumber: '',
  },
  problems: [],
  programChoices: {
    footing: { selected: false, canHelp: false },
    innovation: { selected: false },
    hygiene: { selected: false, isTeamLeader: false },
  },
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showEventAnnouncement, setShowEventAnnouncement] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDraftNotif, setShowDraftNotif] = useState(false);

  const steps = ['Informations', 'Problèmes', 'Programmes', 'Résumé'];

  useEffect(() => {
    if (hasDraft()) {
      setShowDraftNotif(true);
    }
  }, []);

  const handleLoadDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setFormData(draft);
      setShowDraftNotif(false);
    }
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftNotif(false);
  };

  const handleSaveDraft = () => {
    saveDraft(formData);
    alert('Brouillon sauvegardé avec succès !');
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEdit = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!isSupabaseConfigured || !supabase) {
        const errorMsg = 'Supabase n'est pas configuré. Vérifiez vos variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans les paramètres Netlify.';
        console.error('❌ Supabase not configured:', {
          isSupabaseConfigured,
          hasSupabase: !!supabase,
          env: {
            VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET',
            VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
          },
        });
        throw new Error(errorMsg);
      }

      console.log('📤 Submitting form data to Supabase...');
      const { data, error: supabaseError } = await supabase.from('resident_forms').insert([
        {
          first_name: formData.personalInfo.firstName,
          last_name: formData.personalInfo.lastName,
          phone: formData.personalInfo.phone,
          email: formData.personalInfo.email || null,
          room_number: formData.personalInfo.roomNumber,
          problems: formData.problems,
          program_choices: formData.programChoices,
          submitted_at: new Date().toISOString(),
        },
      ]).select();

      if (supabaseError) {
        console.error('❌ Supabase insertion error:', {
          message: supabaseError.message,
          details: supabaseError.details,
          hint: supabaseError.hint,
          code: supabaseError.code,
        });
        
        // Messages d'erreur plus spécifiques
        let errorMessage = 'Une erreur est survenue lors de l\'envoi.';
        if (supabaseError.code === 'PGRST116') {
          errorMessage = 'Erreur : La table "resident_forms" n\'existe pas ou vous n\'avez pas les permissions. Vérifiez votre configuration Supabase.';
        } else if (supabaseError.code === '23505') {
          errorMessage = 'Cette soumission existe déjà.';
        } else if (supabaseError.message) {
          errorMessage = `Erreur Supabase: ${supabaseError.message}`;
        }
        
        throw new Error(errorMessage);
      }

      console.log('✅ Form submitted successfully:', data);
      clearDraft();
      setIsSuccess(true);
    } catch (err) {
      console.error('❌ Submission error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Validation des informations personnelles
  const isPersonalInfoValid = () => {
    const { firstName, lastName, phone, roomNumber } = formData.personalInfo;
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      phone.trim() !== '' &&
      roomNumber.trim() !== ''
    );
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (showEventAnnouncement) {
    return (
      <EventAnnouncement
        onContinue={() => {
          setShowEventAnnouncement(false);
          setFormData(initialState);
          setCurrentStep(0);
        }}
      />
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ucao-blue-50 via-white to-ucao-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-scaleIn">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-ucao-blue-500 to-ucao-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3 font-display">Succès !</h1>
            <p className="text-gray-600 leading-relaxed">
              Votre formulaire a été soumis avec succès. Merci de votre participation !
            </p>
          </div>

          <div className="bg-gradient-to-r from-ucao-blue-50 to-ucao-red-50 border-l-4 border-ucao-blue-500 p-4 rounded-lg mb-6">
            <p className="text-sm text-ucao-blue-900 font-medium">
              Le bureau de la cité vous contactera si nécessaire.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setIsSuccess(false);
                setShowEventAnnouncement(true);
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-ucao-blue-600 via-ucao-red-500 to-ucao-blue-600 text-white rounded-lg hover:from-ucao-blue-700 hover:via-ucao-red-600 hover:to-ucao-blue-700 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Voir l'annonce de l'événement
            </button>
            <button
              onClick={() => {
                setFormData(initialState);
                setCurrentStep(0);
                setIsSuccess(false);
              }}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-all duration-300 transform hover:scale-105 border-2 border-gray-300"
            >
              Soumettre un autre formulaire
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ucao-blue-50 via-white to-ucao-red-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 animate-fadeInUp">
          <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="UCAO Logo"
              className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg animate-float"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 font-display">
            <span className="text-ucao-blue-700">Formulaire des</span>{' '}
            <span className="text-ucao-red-700">Résidents</span>
          </h1>
          <p className="text-gray-700 text-lg font-medium">Cité Universitaire UCAO</p>
          <div className="mt-4 h-1 w-32 bg-gradient-to-r from-ucao-blue-500 to-ucao-red-500 mx-auto rounded-full"></div>
        </div>

        {showDraftNotif && (
          <div className="mb-6 bg-gradient-to-r from-ucao-blue-50 to-ucao-red-50 border-2 border-ucao-blue-300 rounded-lg p-4 flex items-start gap-4 animate-slideInDown shadow-lg">
            <SaveIcon className="w-6 h-6 text-ucao-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-ucao-blue-900">Vous avez un brouillon sauvegardé</p>
              <p className="text-sm text-ucao-blue-800 mt-1">
                Voulez-vous continuer où vous avez arrêté ?
              </p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleLoadDraft}
                  className="px-4 py-2 bg-gradient-to-r from-ucao-blue-600 to-ucao-blue-700 text-white rounded-lg hover:from-ucao-blue-700 hover:to-ucao-blue-800 font-medium transition-all duration-300 transform hover:scale-105 text-sm shadow-md"
                >
                  Charger le brouillon
                </button>
                <button
                  onClick={handleDiscardDraft}
                  className="px-4 py-2 text-ucao-blue-600 border-2 border-ucao-blue-300 rounded-lg hover:bg-ucao-blue-50 font-medium transition-all duration-300 text-sm"
                >
                  Commencer nouveau
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 card animate-fadeIn">
          <StepIndicator steps={steps} currentStep={currentStep} />

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-slideInRight">
              <p className="text-red-800 font-medium">⚠ {error}</p>
            </div>
          )}

          {currentStep === 0 && (
            <PersonalInfoForm
              data={formData.personalInfo}
              onChange={(data) =>
                setFormData({ ...formData, personalInfo: data })
              }
            />
          )}

          {currentStep === 1 && (
            <ProblemsForm
              problems={formData.problems}
              onChange={(problems) =>
                setFormData({ ...formData, problems })
              }
            />
          )}

          {currentStep === 2 && (
            <ProgramsForm
              data={formData.programChoices}
              onChange={(programChoices) =>
                setFormData({ ...formData, programChoices })
              }
            />
          )}

          {currentStep === 3 && (
            <SummaryPreview
              formData={formData}
              onEdit={handleEdit}
            />
          )}

          <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200 gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <ChevronLeft className="w-5 h-5" />
              Précédent
            </button>

            <button
              onClick={handleSaveDraft}
              className="hidden md:flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-ucao-blue-400 text-ucao-blue-700 hover:bg-ucao-blue-50 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <SaveIcon className="w-5 h-5" />
              Brouillon
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={currentStep === 0 && !isPersonalInfoValid()}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-ucao-blue-600 to-ucao-blue-700 text-white hover:from-ucao-blue-700 hover:to-ucao-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
              >
                Suivant
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-ucao-blue-600 via-ucao-red-600 to-ucao-blue-600 text-white hover:from-ucao-blue-700 hover:via-ucao-red-700 hover:to-ucao-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Soumettre
                  </>
                )}
              </button>
            )}
          </div>

          <div className="text-center mt-6 text-xs text-gray-500">
            🔒 Vos données sont sécurisées et confidentielles
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
