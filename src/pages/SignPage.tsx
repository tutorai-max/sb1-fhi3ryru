import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Check } from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import { supabase } from '../lib/supabase';
import ContractPDF from '../components/ContractPDF';
import SignaturePad from '../components/SignaturePad';
import type { Application, Contract } from '../types/database';

export default function SignPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicationData();
  }, [id]);

  const fetchApplicationData = async () => {
    try {
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .select(`
          *
        `)
        .eq('id', id)
        .single();

      if (applicationError) throw applicationError;
      if (!applicationData) throw new Error('Application not found');

      setApplication(applicationData);
      setContract(applicationData.contracts as Contract);
    } catch (err) {
      setError('契約データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureSave = async (signature: string) => {
    try {
      setSignatureData(signature);
      
      // const { error: signatureError } = await supabase
      //   .from('signatures')
      //   .insert([
      //     {
      //       application_id: id,
      //       signature_data: signature,
      //       signed_by: application?.applicant_id,
      //     }
      //   ]);

      // if (signatureError) throw signatureError;

      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          sign_name: signature,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      navigate('/dashboard', { 
        state: { message: '署名が完了しました。契約書のPDFをメールで送信いたします。' }
      });
    } catch (err) {
      setError('署名の保存に失敗しました。');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !application ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || '契約データが見つかりません。'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-900" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">契約書の確認と署名</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">契約書の内容をご確認ください</h2>
              <div className="h-[600px] border rounded-lg overflow-hidden">
                <PDFViewer width="100%" height="100%" className="border-0">
                  {/* <ContractPDF contract={contract} application={application} /> */}
                </PDFViewer>
              </div>
            </div>

            <div className="mb-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="h-4 w-4 text-blue-900 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  契約書の内容を確認し、同意します
                </span>
              </label>
            </div>

            {agreed && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  署名を入力してください
                </h3>
                <SignaturePad onSave={handleSignatureSave} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}