'use client';

import { useState } from 'react';
import MFAInput from './MFAInput';
import { 
  Shield, 
  Download, 
  Copy, 
  Check, 
  CheckCircle, 
  AlertCircle,
  Smartphone,
  Key
} from 'lucide-react';

interface MFASetupWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function MFASetupWizard({ onComplete, onCancel }: MFASetupWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mfaData, setMfaData] = useState<{
    qrCodeUrl?: string;
    backupCodes?: string[];
  }>({});
  const [verificationCode, setVerificationCode] = useState('');
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);

  // Step 1: Initialize MFA setup
  const handleInitialize = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/mfa/setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize MFA');
      }

      setMfaData({
        qrCodeUrl: data.data.qrCodeUrl,
        backupCodes: data.data.backupCodes,
      });

      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify TOTP code
  const handleVerify = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Enable MFA
  const handleEnable = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/mfa/enable', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enable MFA');
      }

      setStep(4);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCodes = () => {
    if (mfaData.backupCodes) {
      navigator.clipboard.writeText(mfaData.backupCodes.join('\n'));
      setCopiedBackupCodes(true);
      setTimeout(() => setCopiedBackupCodes(false), 2000);
    }
  };

  const downloadBackupCodes = () => {
    if (mfaData.backupCodes) {
      const blob = new Blob([mfaData.backupCodes.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'travunited-backup-codes.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${step > s ? 'bg-green-500 text-white' : step === s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-600">Scan QR Code</span>
          <span className="text-xs text-gray-600">Verify Code</span>
          <span className="text-xs text-gray-600">Backup Codes</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Step 1: Introduction */}
      {step === 1 && (
        <div>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Enable Two-Factor Authentication
            </h3>
            <p className="text-gray-600">
              Add an extra layer of security to your account
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Enhanced Security</p>
                <p className="text-sm text-gray-600">
                  Protect your account from unauthorized access
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Smartphone className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Use Your Phone</p>
                <p className="text-sm text-gray-600">
                  Works with Google Authenticator, Microsoft Authenticator, or Authy
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <Key className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Backup Codes</p>
                <p className="text-sm text-gray-600">
                  Get backup codes in case you lose access to your device
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleInitialize}
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Initializing...' : 'Get Started'}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Scan QR Code */}
      {step === 2 && (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Scan QR Code
            </h3>
            <p className="text-gray-600">
              Open your authenticator app and scan this QR code
            </p>
          </div>

          {mfaData.qrCodeUrl && (
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
              <img
                src={mfaData.qrCodeUrl}
                alt="QR Code"
                className="w-64 h-64 mx-auto"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter the 6-digit code from your app
            </label>
            <MFAInput
              value={verificationCode}
              onChange={setVerificationCode}
              onComplete={setVerificationCode}
              disabled={loading}
              error={!!error}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleVerify}
              disabled={loading || verificationCode.length !== 6}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <button
              onClick={onCancel}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Save Backup Codes */}
      {step === 3 && (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Save Your Backup Codes
            </h3>
            <p className="text-gray-600">
              Store these codes in a safe place. You can use them to access your account if you lose your device.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {mfaData.backupCodes?.map((code, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-300 rounded px-3 py-2 text-center font-mono text-sm"
                >
                  {code}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyBackupCodes}
                className="flex-1 btn-outline py-2"
              >
                {copiedBackupCodes ? (
                  <>
                    <Check className="w-4 h-4 mr-2 inline" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2 inline" />
                    Copy Codes
                  </>
                )}
              </button>
              <button
                onClick={downloadBackupCodes}
                className="flex-1 btn-outline py-2"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Download
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Important:</strong> Each backup code can only be used once. Keep them safe and don't share them with anyone.
            </p>
          </div>

          <button
            onClick={handleEnable}
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Enabling...' : 'Complete Setup'}
          </button>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Two-Factor Authentication Enabled!
          </h3>
          <p className="text-gray-600 mb-6">
            Your account is now protected with an additional layer of security.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting...
          </p>
        </div>
      )}
    </div>
  );
}

