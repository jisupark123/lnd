import axios from 'axios';

export const fetchLogout = async () => {
  return await axios.post('/api/logout');
};
