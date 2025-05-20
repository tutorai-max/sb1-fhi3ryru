import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, FileText, Clock, CheckCircle, XCircle, LogOut, ArrowLeft, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Application } from '../types/database';
import { Pencil } from 'lucide-react';


export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicantInfo, setApplicantInfo] = useState({
    company_name: '',
    company_address: '',
    representative_name: '',
    phone: '',
    email: '',
  });
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
  });
  const [contractData, setContractData] = useState({
    initial_cost: 0,
    monthly_cost: 0,
    additional_options: 0,
    special_notes: '',
    training_items: [''],
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleTrainingItemChange = (index: number, value: string) => {
    setContractData(prev => {
      const newItems = [...prev.training_items];
      newItems[index] = value;
      return { ...prev, training_items: newItems };
    });
  };

  const addTrainingItem = () => {
    if (contractData.training_items.length < 8) {
      setContractData(prev => ({
        ...prev,
        training_items: [...prev.training_items, ''],
      }));
    }
  };

  const removeTrainingItem = (index: number) => {
    setContractData(prev => ({
      ...prev,
      training_items: prev.training_items.filter((_, i) => i !== index),
    }));
  };

  const handleContractSubmit = () => {
    navigate('/apply', { 
      state: { 
        contractData,
        applicantInfo,
        contactInfo 
      } 
    });
  };

  // 申請の編集ページへ遷移
  const handleEdit = (id: string) => {
    navigate(`/sign/${id}`);  // ← クエリではなくパスに `id` を含める
    // navigate(`/apply?id=${id}`);   // 例：/apply?id=abcdef
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *
        `)
        .eq('applicant_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      setError('申請の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      setError('ログアウトに失敗しました。');
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'submitted':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>申請済み</span>;
      case 'under_review':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>審査中</span>;
      case 'approved':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>承認済み</span>;
      case 'rejected':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>却下</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>下書き</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                トップページへ
              </button>
              <Building2 className="h-8 w-8 text-blue-900" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">マイページ</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">申請一覧</h2>
            <button
              onClick={() => navigate('/apply')}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800"
            >
              <FileText className="h-4 w-4 mr-2" />
              新規申請
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <Clock className="h-8 w-8 text-gray-400 mx-auto animate-spin" />
              <p className="mt-2 text-gray-500">読み込み中...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <FileText className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">申請はありません</h3>
              <p className="mt-1 text-sm text-gray-500">新規申請から契約手続きを開始してください。</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <li key={application.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <p className="ml-2 text-sm font-medium text-gray-900">
                            {application.contact_name}
                          </p>
                          <p className="ml-2 text-sm font-medium text-gray-900">
                            {application.contact_email}
                          </p>
                        </div>
                        {/* {getStatusBadge(application.status)} */}
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(application.status)}
                          <button
                            onClick={() => handleEdit(application.id)}
                            className="p-1 text-gray-500 hover:text-blue-700 transition"
                            title="編集"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <Building2 className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {application.company_name}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>
                            申請日: {format(new Date(application.created_at), 'yyyy/MM/dd')}
                          </p>
                          <p>
                            作成者アドレス: {user?.email || ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}