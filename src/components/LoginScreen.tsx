import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_CLASSES } from '../data/mockData';
import { 
  GraduationCap, 
  UserCheck, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [isRegistering, setIsRegistering] = useState(false);

  // Form states
  const [username, setUsername] = useState('talaba');
  const [password, setPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Registration specific states
  const [fullName, setFullName] = useState('');
  const [selectedClass, setSelectedClass] = useState(INITIAL_CLASSES[0].name);
  const [teacherSecretCode, setTeacherSecretCode] = useState('');

  // Switch tabs
  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setErrorMsg(null);
    if (!isRegistering) {
      if (role === 'student') {
        setUsername('talaba');
        setPassword('1234');
      } else {
        setUsername('ustoz');
        setPassword('ustoz2026');
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // In a real environment or stored accounts
    const storedUsersJson = localStorage.getItem('edutask_registered_users');
    let registeredUsers: Array<User & { password?: string }> = [];
    if (storedUsersJson) {
      try {
        registeredUsers = JSON.parse(storedUsersJson);
      } catch {}
    }

    if (!isRegistering) {
      // Check built-in demo accounts first
      if (activeTab === 'student') {
        if (username === 'talaba' && password === '1234') {
          onLoginSuccess({
            id: 'usr-student-1',
            name: 'Shaxzod Ibragimov',
            username: 'talaba',
            role: 'student',
            classGroup: '10-A sinf',
          });
          return;
        }
      } else if (activeTab === 'teacher') {
        if (username === 'ustoz' && password === 'ustoz2026') {
          onLoginSuccess({
            id: 'usr-teacher-1',
            name: 'Prof. Alisher Qodirov',
            username: 'ustoz',
            role: 'teacher',
            subject: 'Algebra va Fizika',
          });
          return;
        }
      }

      // Check registered users in storage
      const found = registeredUsers.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password && u.role === activeTab
      );

      if (found) {
        onLoginSuccess({
          id: found.id,
          name: found.name,
          username: found.username,
          role: found.role,
          classGroup: found.classGroup,
          subject: found.subject,
        });
        return;
      }

      // If invalid
      if (activeTab === 'teacher') {
        setErrorMsg("O'qituvchi logini yoki paroli noto'g'ri. Namunaviy: login: ustoz / parol: ustoz2026");
      } else {
        setErrorMsg("O'quvchi logini yoki paroli noto'g'ri. Namunaviy: login: talaba / parol: 1234");
      }
    } else {
      // Handle registration
      if (!fullName.trim() || !username.trim() || !password.trim()) {
        setErrorMsg("Barcha maydonlarni to'ldiring.");
        return;
      }

      if (activeTab === 'teacher') {
        // Must provide school code to become teacher
        if (teacherSecretCode !== 'MAKTAB2026' && teacherSecretCode !== 'USTOZ2026') {
          setErrorMsg("O'qituvchi maxsus kodi noto'g'ri! (Maktab ma'muriyati kodi: MAKTAB2026)");
          return;
        }
      }

      const newUser: User & { password?: string } = {
        id: `usr-${Date.now()}`,
        name: fullName.trim(),
        username: username.trim(),
        role: activeTab,
        classGroup: activeTab === 'student' ? selectedClass : undefined,
        password: password,
      };

      registeredUsers.push(newUser);
      localStorage.setItem('edutask_registered_users', JSON.stringify(registeredUsers));

      onLoginSuccess({
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        role: newUser.role,
        classGroup: newUser.classGroup,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/40 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            EduTask Tizimi
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            O'quvchi va O'qituvchilar Uchun Alohida Himoyalangan Portal
          </p>
        </div>

        {/* Card Box */}
        <div className="mt-6 bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-200">
          {/* Role Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleTabChange('student')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>O'quvchi portali</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('teacher')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'teacher'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>O'qituvchi xonasi</span>
            </button>
          </div>

          {/* Role explanation */}
          <div className={`p-3 rounded-xl mb-5 text-xs border ${
            activeTab === 'student' 
              ? 'bg-blue-50/70 border-blue-200 text-blue-800' 
              : 'bg-amber-50/70 border-amber-200 text-amber-800'
          }`}>
            {activeTab === 'student' ? (
              <p>
                <strong>O'quvchi bo'limi:</strong> Faqat o'zingizga berilgan vazifalar, topshirish muddatlari va daftarni yuklash joyi ko'rinadi. O'qituvchi boshqaruvi yopiq.
              </p>
            ) : (
              <p>
                <strong>O'qituvchi xonasi:</strong> Parol bilan himoyalangan maxsus kabinet. Yangi dars vazifasi e'lon qilish va o'quvchilarni baholash mumkin.
              </p>
            )}
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  To'liq F.I.SH *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masalan: Sardor Aliyev"
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>
            )}

            {isRegistering && activeTab === 'student' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sinf / Guruh *
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  {INITIAL_CLASSES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isRegistering && activeTab === 'teacher' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Maktab / O'qituvchi maxsus kodi *
                </label>
                <input
                  type="password"
                  required
                  value={teacherSecretCode}
                  onChange={(e) => setTeacherSecretCode(e.target.value)}
                  placeholder="Maktab maxsus kodi (Masalan: MAKTAB2026)"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  O'quvchilar o'qituvchi bo'lib kirmasligi uchun maktab kodi kerak.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Foydalanuvchi logini (Username) *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={activeTab === 'student' ? 'talaba' : 'ustoz'}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maxfiy parol *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-9 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <span>{isRegistering ? "Ro'yxatdan o'tish" : "Tizimga kirish"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick preset fill buttons */}
          {!isRegistering && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-400 text-center mb-2">
                Tezkor sinov parollari (1 ta bosishda):
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('student');
                    setUsername('talaba');
                    setPassword('1234');
                  }}
                  className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-700 text-center transition-colors"
                >
                  🎓 O'quvchi (1234)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('teacher');
                    setUsername('ustoz');
                    setPassword('ustoz2026');
                  }}
                  className="p-2 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-[11px] font-medium text-amber-800 text-center transition-colors"
                >
                  🔐 O'qituvchi (ustoz2026)
                </button>
              </div>
            </div>
          )}

          {/* Toggle between Login and Register */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setErrorMsg(null);
              }}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              {isRegistering ? "Hisobingiz bormi? Kirish" : "Yangi o'quvchi yoki o'qituvchi hisobini ochish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
