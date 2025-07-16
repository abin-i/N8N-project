import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import axios from 'axios';
import Modal from './components/Modal';

function App() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('employees').select('*');
      if (error) throw error;
      setEmployees(data || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      const { error } = await supabase.from('employees').insert([formData]);
      if (error) throw error;
      setSuccessMsg('Employee added successfully');
      await fetchEmployees();
      setShowForm(false);
    } catch (err) {
      console.error('Error creating employee:', err);
      setError('Failed to create employee');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update(formData)
        .eq('id', editingEmployee.id);
      if (error) throw error;
      setSuccessMsg('Employee updated successfully');
      await fetchEmployees();
      setEditingEmployee(null);
    } catch (err) {
      console.error('Error updating employee:', err);
      setError('Failed to update employee');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
      setSuccessMsg('Employee deleted');
      await fetchEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError('Failed to delete employee');
    }
  };

  const handleSendEmail = async (employee) => {
    setEmailSending(employee.id);
    setError(null);
    setSuccessMsg(null);

    try {
      const webhookUrl = process.env.REACT_APP_N8N_WEBHOOK_URL || 'https://abin77123.app.n8n.cloud/webhook/send-employee-email';



      const response = await axios.post(
        webhookUrl,
        {
          name: employee.name,
          email: employee.email,
          employeeId: employee.employeeNumber || employee.id,
          department: employee.department || 'General',
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Request-Source': 'employee-manager',
            Authorization: 'Basic ' + btoa('admin:securepassword123'), // Basic Auth for n8n webhook
          },
          timeout: 10000,
        }
      );

      if (response.status === 200) {
        setSuccessMsg(`✅ Email sent to ${employee.email}`);
      } else {
        throw new Error(response.data?.message || 'Failed to send email');
      }
    } catch (err) {
      console.error('Email error:', err);
      setError(
        err.response
          ? `Email failed: ${err.response.status} - ${err.response.data?.message || 'No details'}`
          : err.message
      );
    } finally {
      setEmailSending(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Employee Manager</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          ❌ {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ {successMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center text-lg py-8 animate-pulse">Loading employees...</div>
      ) : (
        <>
          {showForm || editingEmployee ? (
            <Modal open={true} onClose={() => { setEditingEmployee(null); setShowForm(false); }}>
              <EmployeeForm
                employee={editingEmployee}
                onSubmit={editingEmployee ? handleUpdate : handleCreate}
                onCancel={() => {
                  setEditingEmployee(null);
                  setShowForm(false);
                }}
              />
            </Modal>
          ) : (
            <div className="text-right mb-4">
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow"
              >
                ➕ Add New Employee
              </button>
            </div>
          )}

          <EmployeeTable
            employees={employees}
            onEdit={setEditingEmployee}
            onDelete={handleDelete}
            onSendEmail={handleSendEmail}
            emailSending={emailSending}
          />
        </>
      )}
    </div>
  );
}

export default App;
