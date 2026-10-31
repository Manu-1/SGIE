import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  PlusCircle, 
  Filter, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart as PieChartIcon, 
  Calendar, 
  FileText, 
  Settings, 
  UserPlus, 
  Lock, 
  Unlock, 
  ChevronRight,
  Download,
  Building,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';

// --- MOCK INITIAL DATA ---

const INITIAL_CENTERS = [
  { id: 'c1', name: 'Centro Cultural El Roble', city: 'Caracas', director: 'Dra. María Fernández', budget: 15000, currentBalance: 4250 },
  { id: 'c2', name: 'Residencia Universitaria Los Cedros', city: 'Montevideo', director: 'P. Alejandro Gómez', budget: 28000, currentBalance: 8900 },
  { id: 'c3', name: 'Centro Juvenil Montealto', city: 'Bogotá', director: 'Ing. Carlos Mendoza', budget: 12000, currentBalance: 3100 },
  { id: 'c4', name: 'Casa de Encuentros La Cantera', city: 'Santiago', director: 'Sra. Carmen Silva', budget: 45000, currentBalance: 12400 },
];

const INITIAL_CATEGORIES = {
  ingreso: ['Donaciones u Ofrendas', 'Aportes Mensuales', 'Eventos / Actividades', 'Cursos y Talleres', 'Otros Ingresos'],
  egreso: ['Alimentación y Servicios', 'Mantenimiento y Reparaciones', 'Servicios Públicos (Luz/Agua/Internet)', 'Material Formativo / Libros', 'Ayudas Sociales / Solidaridad', 'Gastos Administrativos']
};

const INITIAL_TRANSACTIONS = [
  { id: 't1', centerId: 'c1', type: 'ingreso', category: 'Aportes Mensuales', amount: 3500, date: '2026-10-02', description: 'Aportes de cooperadores del mes', registeredBy: 'María Fernández' },
  { id: 't2', centerId: 'c1', type: 'egreso', category: 'Servicios Públicos (Luz/Agua/Internet)', amount: 420, date: '2026-10-05', description: 'Pago de electricidad e internet de alta velocidad', registeredBy: 'María Fernández' },
  { id: 't3', centerId: 'c2', type: 'ingreso', category: 'Donaciones u Ofrendas', amount: 8200, date: '2026-10-10', description: 'Donación extraordinaria para renovación de biblioteca', registeredBy: 'Alejandro Gómez' },
  { id: 't4', centerId: 'c2', type: 'egreso', category: 'Mantenimiento y Reparaciones', amount: 1450, date: '2026-10-12', description: 'Reparación de filtración en cocina principal', registeredBy: 'Alejandro Gómez' },
  { id: 't5', centerId: 'c3', type: 'ingreso', category: 'Cursos y Talleres', amount: 1800, date: '2026-10-15', description: 'Inscripciones al Taller de Liderazgo Juvenil', registeredBy: 'Carlos Mendoza' },
  { id: 't6', centerId: 'c3', type: 'egreso', category: 'Alimentación y Servicios', amount: 950, date: '2026-10-18', description: 'Insumos de despensa para el mes', registeredBy: 'Carlos Mendoza' },
  { id: 't7', centerId: 'c4', type: 'ingreso', category: 'Eventos / Actividades', amount: 5600, date: '2026-10-20', description: 'Retiro de fin de semana para profesionales', registeredBy: 'Carmen Silva' },
  { id: 't8', centerId: 'c4', type: 'egreso', category: 'Material Formativo / Libros', amount: 680, date: '2026-10-22', description: 'Adquisición de libros para la biblioteca del centro', registeredBy: 'Carmen Silva' },
  { id: 't9', centerId: 'c1', type: 'egreso', category: 'Alimentación y Servicios', amount: 1100, date: '2026-10-25', description: 'Compra mensual de víveres', registeredBy: 'María Fernández' },
  { id: 't10', centerId: 'c2', type: 'ingreso', category: 'Aportes Mensuales', amount: 4100, date: '2026-10-28', description: 'Aportes mensuales de miembros y familias', registeredBy: 'Alejandro Gómez' },
];

const INITIAL_USERS = [
  { id: 'u1', name: 'Padre Javier Martínez', email: 'jmartinez@opusdei.org', role: 'SuperAdmin', centerId: 'ALL', status: 'Activo' },
  { id: 'u2', name: 'Dra. María Fernández', email: 'mfernandez@elroble.org', role: 'AdminCentro', centerId: 'c1', status: 'Activo' },
  { id: 'u3', name: 'P. Alejandro Gómez', email: 'agomez@loscedros.org', role: 'AdminCentro', centerId: 'c2', status: 'Activo' },
  { id: 'u4', name: 'Lic. Roberto Sánchez', email: 'rsanchez@auditoria.org', role: 'Auditor', centerId: 'ALL', status: 'Activo' },
  { id: 'u5', name: 'Carlos Mendoza', email: 'cmendoza@montealto.org', role: 'Operador', centerId: 'c3', status: 'Activo' },
];

const ROLES_INFO = {
  SuperAdmin: { name: 'Super Administrador', desc: 'Acceso total a todos los centros, registros financieros, reportes y módulo de administración de usuarios/roles.', badgeBg: 'bg-purple-100 text-purple-800' },
  AdminCentro: { name: 'Administrador de Centro', desc: 'Acceso completo para registrar y ver ingresos/egresos únicamente de su Centro asignado.', badgeBg: 'bg-blue-100 text-blue-800' },
  Auditor: { name: 'Auditor / Revisor', desc: 'Acceso de solo lectura a los dashboards y reportes de todos los centros para fiscalización.', badgeBg: 'bg-amber-100 text-amber-800' },
  Operador: { name: 'Operador / Auxiliar', desc: 'Permiso para registrar transacciones de ingresos/egresos, sin acceso a modificaciones estructurales.', badgeBg: 'bg-emerald-100 text-emerald-800' },
};

export default function App() {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [centers, setCenters] = useState(INITIAL_CENTERS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [users, setUsers] = useState(INITIAL_USERS);
  
  // Current logged in user (simulation)
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]);

  // Filters state
  const [selectedCenterFilter, setSelectedCenterFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalTransactionOpen, setIsModalTransactionOpen] = useState(false);
  const [isModalUserOpen, setIsModalUserOpen] = useState(false);
  const [isModalCenterOpen, setIsModalCenterOpen] = useState(false);

  // Form states
  const [newTransaction, setNewTransaction] = useState({
    centerId: centers[0]?.id || '',
    type: 'ingreso',
    category: INITIAL_CATEGORIES.ingreso[0],
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'AdminCentro',
    centerId: 'c1'
  });

  const [newCenter, setNewCenter] = useState({
    name: '',
    city: '',
    director: '',
    budget: ''
  });

  // Allowed center view calculation
  const accessibleCenterIds = useMemo(() => {
    if (currentUser.role === 'SuperAdmin' || currentUser.role === 'Auditor') {
      return 'ALL';
    }
    return currentUser.centerId;
  }, [currentUser]);

  // Filtered transactions calculation
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Permission filter
      if (accessibleCenterIds !== 'ALL' && t.centerId !== accessibleCenterIds) {
        return false;
      }
      // UI Center Filter
      if (selectedCenterFilter !== 'ALL' && t.centerId !== selectedCenterFilter) {
        return false;
      }
      // Type Filter
      if (selectedTypeFilter !== 'ALL' && t.type !== selectedTypeFilter) {
        return false;
      }
      // Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          t.description.toLowerCase().includes(term) ||
          t.category.toLowerCase().includes(term) ||
          t.registeredBy.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [transactions, accessibleCenterIds, selectedCenterFilter, selectedTypeFilter, searchTerm]);

  // Calculated Metrics
  const metrics = useMemo(() => {
    const listToCalc = accessibleCenterIds === 'ALL' 
      ? (selectedCenterFilter === 'ALL' ? transactions : transactions.filter(t => t.centerId === selectedCenterFilter))
      : transactions.filter(t => t.centerId === accessibleCenterIds);

    const totalIngresos = listToCalc
      .filter(t => t.type === 'ingreso')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalEgresos = listToCalc
      .filter(t => t.type === 'egreso')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balanceNeto = totalIngresos - totalEgresos;

    return { totalIngresos, totalEgresos, balanceNeto };
  }, [transactions, accessibleCenterIds, selectedCenterFilter]);

  // Chart data calculation
  const chartDataPerCenter = useMemo(() => {
    return centers.map(center => {
      const cIngresos = transactions
        .filter(t => t.centerId === center.id && t.type === 'ingreso')
        .reduce((acc, t) => acc + Number(t.amount), 0);
      const cEgresos = transactions
        .filter(t => t.centerId === center.id && t.type === 'egreso')
        .reduce((acc, t) => acc + Number(t.amount), 0);

      return {
        name: center.name.replace('Centro ', '').replace('Residencia ', ''),
        Ingresos: cIngresos,
        Egresos: cEgresos,
        Balance: cIngresos - cEgresos
      };
    });
  }, [centers, transactions]);

  const chartCategoryBreakdown = useMemo(() => {
    const catMap = {};
    transactions.forEach(t => {
      if (accessibleCenterIds !== 'ALL' && t.centerId !== accessibleCenterIds) return;
      if (selectedCenterFilter !== 'ALL' && t.centerId !== selectedCenterFilter) return;

      if (!catMap[t.category]) {
        catMap[t.category] = 0;
      }
      catMap[t.category] += Number(t.amount);
    });

    return Object.keys(catMap).map(key => ({
      name: key,
      value: catMap[key]
    }));
  }, [transactions, accessibleCenterIds, selectedCenterFilter]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Handlers
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTransaction.amount || Number(newTransaction.amount) <= 0) return;

    const item = {
      id: 't' + (transactions.length + 1),
      centerId: newTransaction.centerId,
      type: newTransaction.type,
      category: newTransaction.category,
      amount: parseFloat(newTransaction.amount),
      date: newTransaction.date,
      description: newTransaction.description,
      registeredBy: currentUser.name
    };

    setTransactions([item, ...transactions]);
    setIsModalTransactionOpen(false);
    setNewTransaction({
      centerId: centers[0]?.id || '',
      type: 'ingreso',
      category: INITIAL_CATEGORIES.ingreso[0],
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const item = {
      id: 'u' + (users.length + 1),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      centerId: newUser.role === 'SuperAdmin' || newUser.role === 'Auditor' ? 'ALL' : newUser.centerId,
      status: 'Activo'
    };

    setUsers([...users, item]);
    setIsModalUserOpen(false);
    setNewUser({ name: '', email: '', role: 'AdminCentro', centerId: 'c1' });
  };

  const handleAddCenter = (e) => {
    e.preventDefault();
    if (!newCenter.name || !newCenter.budget) return;

    const item = {
      id: 'c' + (centers.length + 1),
      name: newCenter.name,
      city: newCenter.city,
      director: newCenter.director,
      budget: parseFloat(newCenter.budget),
      currentBalance: 0
    };

    setCenters([...centers, item]);
    setIsModalCenterOpen(false);
    setNewCenter({ name: '', city: '', director: '', budget: '' });
  };

  const getCenterName = (id) => {
    const found = centers.find(c => c.id === id);
    return found ? found.name : 'Todos los Centros';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* --- HEADER --- */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LOGO & TITLE */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-900 font-bold shadow">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                  SGIE - Centros
                </h1>
                <p className="text-xs text-slate-400">Sistema Integrado de Control Financiero</p>
              </div>
            </div>

            {/* ROLE / USER SIMULATION SWITCHER */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-400 font-medium">Simular usuario:</span>
                <select 
                  className="bg-slate-900 text-amber-300 text-xs font-semibold rounded px-2 py-1 focus:outline-none border border-slate-700 cursor-pointer"
                  value={currentUser.id}
                  onChange={(e) => {
                    const found = users.find(u => u.id === e.target.value);
                    if (found) {
                      setCurrentUser(found);
                      if (found.centerId !== 'ALL') {
                        setSelectedCenterFilter(found.centerId);
                      } else {
                        setSelectedCenterFilter('ALL');
                      }
                    }
                  }}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({ROLES_INFO[u.role]?.name || u.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* CURRENT ROLE BADGE */}
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ROLES_INFO[currentUser.role]?.badgeBg}`}>
                  {ROLES_INFO[currentUser.role]?.name}
                </span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* --- MAIN CONTAINER --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full">
        
        {/* TOP BANNER / PERMISSION CONTEXT */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Acceso Actual</span>
            <h2 className="text-xl font-bold text-slate-800">
              {currentUser.centerId === 'ALL' 
                ? 'Vista Consolidada (Todos los Centros)' 
                : `Centro: ${getCenterName(currentUser.centerId)}`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bienvenido, <strong className="text-slate-700">{currentUser.name}</strong>. {currentUser.role === 'Auditor' ? 'Modo revisión activa.' : 'Gestión de registros contables y presupuesto.'}
            </p>
          </div>

          {/* QUICK ACTION BUTTON */}
          {(currentUser.role === 'SuperAdmin' || currentUser.role === 'AdminCentro' || currentUser.role === 'Operador') && (
            <button
              onClick={() => setIsModalTransactionOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2.5 rounded-lg transition shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Registrar Movimiento</span>
            </button>
          )}
        </div>

        {/* --- NAVIGATION TABS --- */}
        <div className="flex border-b border-slate-200 mb-6 space-x-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-3 px-1 text-sm font-semibold flex items-center space-x-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            <span>Dashboard Principal</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-3 px-1 text-sm font-semibold flex items-center space-x-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Ingresos y Egresos</span>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold ml-1">
              {filteredTransactions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('centers')}
            className={`pb-3 px-1 text-sm font-semibold flex items-center space-x-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'centers'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Centros ({centers.length})</span>
          </button>

          {/* ADMIN ONLY TAB */}
          {currentUser.role === 'SuperAdmin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`pb-3 px-1 text-sm font-semibold flex items-center space-x-2 border-b-2 transition whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Módulo Admin / Roles</span>
            </button>
          )}
        </div>

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 1: DASHBOARD */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* FILTER BAR FOR DASHBOARD */}
            {accessibleCenterIds === 'ALL' && (
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-sm text-slate-600 font-medium">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span>Filtrar Dashboard por Centro:</span>
                </div>
                <select
                  value={selectedCenterFilter}
                  onChange={(e) => setSelectedCenterFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg p-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="ALL">🏢 Todos los Centros Consolidados</option>
                  {centers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* KPI METRICS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* CARD INGRESOS */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Ingresos</p>
                  <h3 className="text-2xl font-black text-emerald-600 mt-1">
                    ${metrics.totalIngresos.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>
                  <div className="flex items-center text-emerald-600 text-xs font-semibold mt-2">
                    <ArrowUpRight className="w-4 h-4 mr-0.5" />
                    <span>Entradas registradas</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              {/* CARD EGRESOS */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Egresos</p>
                  <h3 className="text-2xl font-black text-rose-600 mt-1">
                    ${metrics.totalEgresos.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>
                  <div className="flex items-center text-rose-600 text-xs font-semibold mt-2">
                    <ArrowDownRight className="w-4 h-4 mr-0.5" />
                    <span>Salidas y Gastos</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6" />
                </div>
              </div>

              {/* CARD BALANCE NETO */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Balance Operativo</p>
                  <h3 className={`text-2xl font-black mt-1 ${metrics.balanceNeto >= 0 ? 'text-indigo-600' : 'text-amber-600'}`}>
                    ${metrics.balanceNeto.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>
                  <div className="flex items-center text-slate-500 text-xs font-semibold mt-2">
                    <span>Superávit / Líquido disponible</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* BAR CHART: COMPARATIVA POR CENTRO */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Comparativa por Centro</h3>
                  <p className="text-xs text-slate-500">Relación de Ingresos vs Egresos por sede</p>
                </div>
                <div className="h-64 mt-4 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataPerCenter} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Egresos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PIE CHART: DISTRIBUCIÓN POR CATEGORÍA */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Distribución de Movimientos</h3>
                  <p className="text-xs text-slate-500">Monto total agrupado por Partidas / Categorías</p>
                </div>
                <div className="h-64 mt-4 w-full flex items-center justify-center">
                  {chartCategoryBreakdown.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartCategoryBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {chartCategoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-xs text-slate-400">No hay datos suficientes para mostrar gráfico.</p>
                  )}
                </div>
              </div>

            </div>

            {/* ULTIMOS MOVIMIENTOS RESUMEN */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-800">Últimos Registros</h3>
                <button 
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center space-x-1"
                >
                  <span>Ver todas las transacciones</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredTransactions.slice(0, 4).map(t => (
                  <div key={t.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${t.type === 'ingreso' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {t.type === 'ingreso' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{t.description}</p>
                        <p className="text-xs text-slate-400">
                          {getCenterName(t.centerId)} • <span className="text-slate-500 font-medium">{t.category}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${t.type === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'ingreso' ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-400">{t.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 2: TRANSACCIONES (INGRESOS Y EGRESOS) */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            
            {/* FILTERS AND SEARCH TOOLBAR */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
              
              {/* SEARCH INPUT */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por concepto o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* FILTERS GROUP */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                
                {/* CENTER FILTER */}
                {accessibleCenterIds === 'ALL' && (
                  <select
                    value={selectedCenterFilter}
                    onChange={(e) => setSelectedCenterFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded-lg p-2.5 font-medium"
                  >
                    <option value="ALL">🏢 Todos los Centros</option>
                    {centers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}

                {/* TYPE FILTER */}
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded-lg p-2.5 font-medium"
                >
                  <option value="ALL">🔄 Todos los Tipos</option>
                  <option value="ingreso">🟢 Ingresos</option>
                  <option value="egreso">🔴 Egresos</option>
                </select>

                <button 
                  onClick={() => { setSearchTerm(''); setSelectedCenterFilter('ALL'); setSelectedTypeFilter('ALL'); }}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200"
                  title="Limpiar filtros"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* TRANSACTIONS TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Fecha</th>
                      <th className="py-3 px-4">Centro</th>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Partida / Categoría</th>
                      <th className="py-3 px-4">Concepto / Descripción</th>
                      <th className="py-3 px-4 text-right">Monto</th>
                      <th className="py-3 px-4 text-center">Registrado por</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">{t.date}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                            {getCenterName(t.centerId)}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                              t.type === 'ingreso' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {t.type === 'ingreso' ? 'Ingreso' : 'Egreso'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{t.category}</td>
                          <td className="py-3.5 px-4 text-slate-800 font-medium">{t.description}</td>
                          <td className={`py-3.5 px-4 text-right font-bold whitespace-nowrap ${
                            t.type === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {t.type === 'ingreso' ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-4 text-center text-xs text-slate-500">{t.registeredBy}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-slate-400">
                          No se encontraron transacciones con los filtros seleccionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 3: GESTIÓN DE CENTROS */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'centers' && (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Directorio de Centros Financieros</h3>
                <p className="text-xs text-slate-500">Resumen y asignación de presupuestos asignados por centro</p>
              </div>

              {currentUser.role === 'SuperAdmin' && (
                <button
                  onClick={() => setIsModalCenterOpen(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Nuevo Centro</span>
                </button>
              )}
            </div>

            {/* CENTRES CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {centers.map(center => {
                const centerIngresos = transactions
                  .filter(t => t.centerId === center.id && t.type === 'ingreso')
                  .reduce((sum, t) => sum + Number(t.amount), 0);

                const centerEgresos = transactions
                  .filter(t => t.centerId === center.id && t.type === 'egreso')
                  .reduce((sum, t) => sum + Number(t.amount), 0);

                const centerBalance = centerIngresos - centerEgresos;
                const percentBudget = ((centerEgresos / center.budget) * 100).toFixed(1);

                return (
                  <div key={center.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-amber-600 font-bold uppercase">{center.city}</span>
                        <h4 className="text-base font-bold text-slate-800">{center.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Encargado: {center.director}</p>
                      </div>
                      <span className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Building2 className="w-5 h-5" />
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Ingresos</span>
                        <span className="text-xs font-bold text-emerald-600">${centerIngresos.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Egresos</span>
                        <span className="text-xs font-bold text-rose-600">${centerEgresos.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Disponible</span>
                        <span className="text-xs font-bold text-indigo-600">${centerBalance.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* BUDGET EXECUTION PROGRESS BAR */}
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-slate-500">Ejecución Presupuestaria</span>
                        <span className="text-slate-700 font-bold">{percentBudget}% de ${center.budget.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${Number(percentBudget) > 90 ? 'bg-rose-500' : 'bg-amber-500'}`}
                          style={{ width: `${Math.min(Number(percentBudget), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* --------------------------------------------------------------------------------- */}
        {/* TAB 4: MÓDULO ADMIN - ROLES & PERMISOS */}
        {/* --------------------------------------------------------------------------------- */}
        {activeTab === 'admin' && currentUser.role === 'SuperAdmin' && (
          <div className="space-y-6">
            
            {/* INTRO BOX */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
              <ShieldCheck className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">Panel de Control de Roles y Accesos</h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Desde aquí puedes asignar usuarios a centros específicos, otorgar permisos de auditoría o definir administradores generales del sistema.
                </p>
              </div>
            </div>

            {/* ROLES MATRIX / EXPLANATION */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h4 className="text-sm font-bold text-slate-800 mb-4">Niveles de Permisos Configurados</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.keys(ROLES_INFO).map(roleKey => (
                  <div key={roleKey} className="border border-slate-200 p-4 rounded-lg bg-slate-50/50">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-2 ${ROLES_INFO[roleKey].badgeBg}`}>
                      {ROLES_INFO[roleKey].name}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">{ROLES_INFO[roleKey].desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* USERS TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h4 className="text-base font-bold text-slate-800">Usuarios Registrados ({users.length})</h4>
                <button
                  onClick={() => setIsModalUserOpen(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Crear Nuevo Usuario</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Usuario</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Rol Asignado</th>
                      <th className="py-3 px-4">Centro Asignado</th>
                      <th className="py-3 px-4 text-center">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-800">{u.name}</td>
                        <td className="py-3 px-4 text-slate-600">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${ROLES_INFO[u.role]?.badgeBg}`}>
                            {ROLES_INFO[u.role]?.name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {u.centerId === 'ALL' ? '🌐 Acceso Global' : getCenterName(u.centerId)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button className="text-slate-400 hover:text-amber-600 font-medium text-xs">Editar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* --- MODAL: REGISTRAR TRANSMISIÓN / MOVIMIENTO --- */}
      {isModalTransactionOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Registrar Movimiento Financiero</h3>
              <button onClick={() => setIsModalTransactionOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              
              {/* CENTRO */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Centro</label>
                {currentUser.centerId === 'ALL' ? (
                  <select
                    value={newTransaction.centerId}
                    onChange={(e) => setNewTransaction({ ...newTransaction, centerId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                  >
                    {centers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={getCenterName(currentUser.centerId)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-slate-600"
                  />
                )}
              </div>

              {/* TIPO: INGRESO O EGRESO */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewTransaction({ 
                    ...newTransaction, 
                    type: 'ingreso', 
                    category: INITIAL_CATEGORIES.ingreso[0] 
                  })}
                  className={`p-3 rounded-lg border text-sm font-bold flex items-center justify-center space-x-2 ${
                    newTransaction.type === 'ingreso'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'border-slate-200 text-slate-500'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Ingreso</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewTransaction({ 
                    ...newTransaction, 
                    type: 'egreso', 
                    category: INITIAL_CATEGORIES.egreso[0] 
                  })}
                  className={`p-3 rounded-lg border text-sm font-bold flex items-center justify-center space-x-2 ${
                    newTransaction.type === 'egreso'
                      ? 'bg-rose-50 border-rose-500 text-rose-700'
                      : 'border-slate-200 text-slate-500'
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Egreso</span>
                </button>
              </div>

              {/* CATEGORÍA */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Partida / Categoría</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                >
                  {(newTransaction.type === 'ingreso' ? INITIAL_CATEGORIES.ingreso : INITIAL_CATEGORIES.egreso).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* MONTO & FECHA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Monto ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>

              {/* CONCEPTO */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Concepto / Descripción</label>
                <textarea
                  rows="2"
                  placeholder="Ej: Pago de reparaciones de electricidad..."
                  required
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                ></textarea>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalTransactionOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold"
                >
                  Guardar Registro
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: NUEVO USUARIOS (ADMIN) --- */}
      {isModalUserOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Crear Nuevo Usuario</h3>
              <button onClick={() => setIsModalUserOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pedro Morales"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@opusdei.org"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rol en el Sistema</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-medium"
                >
                  <option value="AdminCentro">Administrador de Centro</option>
                  <option value="Operador">Operador / Auxiliar</option>
                  <option value="Auditor">Auditor (Acceso Lectura Global)</option>
                  <option value="SuperAdmin">Super Administrador</option>
                </select>
              </div>

              {newUser.role !== 'SuperAdmin' && newUser.role !== 'Auditor' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Centro Asignado</label>
                  <select
                    value={newUser.centerId}
                    onChange={(e) => setNewUser({ ...newUser, centerId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                  >
                    {centers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalUserOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: NUEVO CENTRO --- */}
      {isModalCenterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Registrar Nuevo Centro</h3>
              <button onClick={() => setIsModalCenterOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCenter} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre del Centro</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Centro Cultural Miraflores"
                  value={newCenter.name}
                  onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ciudad / Ubicación</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Valencia"
                  value={newCenter.city}
                  onChange={(e) => setNewCenter({ ...newCenter, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Director / Encargado</label>
                <input
                  type="text"
                  placeholder="Ej: Lic. Andrés Páez"
                  value={newCenter.director}
                  onChange={(e) => setNewCenter({ ...newCenter, director: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Presupuesto Anual Asignado ($)</label>
                <input
                  type="number"
                  required
                  placeholder="20000"
                  value={newCenter.budget}
                  onChange={(e) => setNewCenter({ ...newCenter, budget: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalCenterOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold"
                >
                  Guardar Centro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          SGIE DEMO • Sistema de Gestión de Ingresos y Egresos para Centros • {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}