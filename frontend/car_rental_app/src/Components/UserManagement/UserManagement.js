import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from './UserCard';
import EditUserModal from '../EditUserModal'; // Ensure this path is correct
import './UserManagement.css'; // Ensure this path is correct

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users'); 
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/users/${userId}`); 

      // Filter out the user from the current state to immediately reflect the change
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleUpdateConfirm = async (userId, updatedUserDetails) => {
    try {
      await axios.put(`/users/${userId}`, updatedUserDetails); 

      // Refetch or manually update the users list to reflect the changes
      const updatedList = await axios.get('/users'); 
      setUsers(updatedList.data);
      setEditModalOpen(false);
      setSelectedUser(null); // Reset the selected user
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <div className="container">
        {users.map(user => (
          <UserCard
            key={user._id}
            user={user}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          user={selectedUser}
          onConfirm={handleUpdateConfirm}
        />
      )}
    </div>
  );
};

export default UserManagement;
