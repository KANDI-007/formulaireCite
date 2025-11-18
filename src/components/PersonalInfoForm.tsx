import { User, Mail, Phone, Home } from 'lucide-react';
import { PersonalInfo } from '../types/forms';
import { validateForm } from '../utils/validation';
import { useState } from 'react';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleValidation = () => {
    const validationErrors = validateForm(
      data.firstName,
      data.lastName,
      data.phone,
      data.email,
      data.roomNumber
    );
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleBlur = () => {
    handleValidation();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="mb-8 animate-slideInRight">
        <h2 className="text-3xl font-bold mb-2 font-display">
          <span className="text-ucao-blue-700">Informations</span>{' '}
          <span className="text-ucao-red-700">Personnelles</span>
        </h2>
        <p className="text-gray-600 font-medium">Remplissez vos informations pour nous permettre de mieux vous servir</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
            <User className="w-4 h-4 mr-2 text-ucao-blue-600" />
            Prénom <span className="text-ucao-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={handleBlur}
            className={`input-field ${
              errors.firstName
                ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-300'
                : 'border-gray-300 focus:border-ucao-blue-500'
            }`}
            placeholder="Ditoma Didier "
          />
          {errors.firstName && (
            <p className="text-red-600 text-xs mt-1 flex items-center">
              ⚠ {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
            <User className="w-4 h-4 mr-2 text-ucao-blue-600" />
            Nom <span className="text-ucao-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={handleBlur}
            className={`input-field ${
              errors.lastName
                ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-300'
                : 'border-gray-300 focus:border-ucao-blue-500'
            }`}
            placeholder="NORAMA"
          />
          {errors.lastName && (
            <p className="text-red-600 text-xs mt-1 flex items-center">
              ⚠ {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
            <Phone className="w-4 h-4 mr-2 text-ucao-blue-600" />
            Téléphone (WhatsApp) <span className="text-ucao-red-500 ml-1">*</span>
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={handleBlur}
            className={`input-field ${
              errors.phone
                ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-300'
                : 'border-gray-300 focus:border-ucao-blue-500'
            }`}
            placeholder="+237 6XX XXX XXX"
          />
          {errors.phone && (
            <p className="text-red-600 text-xs mt-1 flex items-center">
              ⚠ {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-800 mb-1">
            <Mail className="w-4 h-4 mr-2 text-ucao-blue-600" />
            Email <span className="text-gray-500 text-xs font-normal ml-2">(optionnel)</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={handleBlur}
            className={`input-field ${
              errors.email
                ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-300'
                : 'border-gray-300 focus:border-ucao-blue-500'
            }`}
            placeholder="jean.dupont@email.com"
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1 flex items-center">
              ⚠ {errors.email}
            </p>
          )}
          {!errors.email && (
            <p className="text-xs text-gray-500 mt-1">Nous contacterons plutôt par téléphone.</p>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
          <Home className="w-4 h-4 mr-2 text-ucao-blue-600" />
          Numéro de Chambre <span className="text-ucao-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={data.roomNumber}
          onChange={(e) => handleChange('roomNumber', e.target.value)}
          onBlur={handleBlur}
          className={`input-field ${
            errors.roomNumber
              ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-300'
              : 'border-gray-300 focus:border-ucao-blue-500'
          }`}
          placeholder="205 ou B-15"
        />
        {errors.roomNumber && (
          <p className="text-red-600 text-xs mt-1 flex items-center">
            ⚠ {errors.roomNumber}
          </p>
        )}
      </div>

      <div className="bg-gradient-to-r from-ucao-blue-50 to-ucao-red-50 border-l-4 border-ucao-blue-500 p-4 rounded-lg animate-slideInUp">
        <p className="text-sm text-ucao-blue-900 font-medium">
          💡 Ces informations nous aideront à vous contacter rapidement en cas de besoin.
        </p>
      </div>
    </div>
  );
}
