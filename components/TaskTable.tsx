
import React from 'react';
import { Task, UserRole, Priority, Status } from '../types';
import { PRIORITIES } from '../constants';
import { checkPriorityLimit } from '../utils';

interface Props {
  tasks: Task[];
  allTasks: Task[]; 
  role: UserRole;
  onUpdateTask: (task: Task) => void;
  onViewDetails: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const TaskTable: React.FC<Props> = ({ tasks, allTasks, role, onUpdateTask, onViewDetails, onDeleteTask }) => {
  
  const handlePriorityChange = (task: Task, newPriority: Priority) => {
    if (role !== 'Head') return;
    
    const check = checkPriorityLimit(allTasks, task.week, task.responsible, task.area, newPriority, task.id);
    if (!check.allowed) {
      alert(check.message);
      return;
    }
    onUpdateTask({ ...task, priority: newPriority });
  };

    const handleStatusChange = (task: Task, newStatus: Status) => {
    const updatedTask = newStatus === 'Completada' 
      ? { ...task, status: newStatus, priority: 'Baja' as Priority }
      : { ...task, status: newStatus };
    onUpdateTask(updatedTask);
  };
  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'Urgente': return 'bg-purple-100 text-purple-800 border-purple-200 font-black animate-pulse';
      case 'Alta': return 'bg-red-100 text-red-700 border-red-200';
      case 'Media': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Baja': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (s: string) => {
    if (s.includes('Bloqueada')) return 'bg-orange-100 text-orange-700 border-orange-300 border font-bold';
    if (s === 'Completada') return 'bg-blue-100 text-blue-700';
    if (s === 'En progreso') return 'bg-indigo-100 text-indigo-700';
    return 'bg-gray-100 text-gray-700';
  };

  const formatDeliveryDate = (dateStr?: string) => {
    if (!dateStr) return 'Pendiente';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year.slice(-2)}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 no-scrollbar">
      <div className="overflow-x-auto no-scrollbar">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider w-[120px]">Prioridad</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider min-w-[350px]">Tarea</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider w-[110px]">Entrega</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider w-[180px]">Persona</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider w-[200px]">Responsable</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider w-[180px]">Estado</th>
              <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider w-[100px]">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map(task => (
              <tr 
                key={task.id} 
                className="hover:bg-blue-50/40 transition-colors group cursor-pointer align-top" 
                onClick={() => onViewDetails(task)}
              >
                <td className="px-6 py-6" onClick={e => e.stopPropagation()}>
                  {role === 'Head' ? (
                    <select
                      value={task.priority}
                      onChange={e => handlePriorityChange(task, e.target.value as Priority)}
                      className={`p-1.5 border rounded-lg text-[10px] font-black uppercase outline-none cursor-pointer w-full ${getPriorityColor(task.priority)}`}
                    >
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  ) : (
                    <span className={`px-2.5 py-1.5 text-[10px] font-black uppercase rounded-lg border inline-block ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  )}
                </td>
                <td className="px-6 py-6">
                              <div className={``text-base font-bold t-ext-gray-800 whitespace-normal break-words leading-tight ${ task.status === 'Completada' ? 'line-through opacity-60' : '' }`}`>
              {task.title}
            </div>
            </td>                <td className="px-6 py-6">
                  <span className={`text-[11px] font-black uppercase whitespace-nowrap ${task.deliveryDate ? 'text-brand-dark' : 'text-gray-300 italic'}`}>
                    {formatDeliveryDate(task.deliveryDate)}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <span className={`text-sm font-semibold whitespace-normal break-words ${task.requester.includes('Pendiente') ? 'text-blue-500 italic' : 'text-gray-600'}`}>
                    {task.requester}
                  </span>
                </td>
                <td className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-tight whitespace-normal break-words">
                  {task.responsible}
                </td>
                <td className="px-6 py-6" onClick={e => e.stopPropagation()}>
                  <select
                    value={task.status}
                    onChange={e => handleStatusChange(task, e.target.value as Status)}
                    className={`p-1.5 border rounded-lg text-[10px] font-black uppercase outline-none cursor-pointer w-full ${getStatusColor(task.status)}`}
                  >
                    <option value="Bloqueada (falta Basecamp)">Bloqueada (falta BC)</option>
                    <option value="Activa">Activa</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Completada">Completada</option>
                  </select>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <div className="text-gray-300 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                      <span className="text-xs font-black">{task.comments.length}</span>
                    </div>
                    {role === 'Head' && (
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDeleteTask(task.id);
                        }}
                        className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                        title="Eliminar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
