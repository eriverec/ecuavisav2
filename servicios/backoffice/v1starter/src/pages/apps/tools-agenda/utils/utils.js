const API_URL = 'https://micuenta.ecuavisa.com/gestion-agenda/api-v3.php';

export const loadRecords = async (selectedMonth) => {
  try {
    const response = await fetch(`${API_URL}?api=web&key=${selectedMonth}&folder=agenda`);
    const data = await response.json();
    if (data.success && data.data && Array.isArray(data.data)) {
      return data.data.map((record, index) => ({
        ...record,
        position: record.position ?? index + 1
      }));
    } else {
      await createEmptyRecords(selectedMonth);
      return [];
    }
  } catch (error) {
    console.error('Error fetching records:', error);
    return [];
  }
};

export const saveRecords = async (month, records) => {
  if (!month) return;
  try {
    await fetch(`${API_URL}?api=update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: month, folder: 'agenda', estructura: records })
    });
  } catch (error) {
    console.error('Error saving records:', error);
    throw new Error('Error al guardar los datos');
  }
};

const createEmptyRecords = async (selectedMonth) => {
    try {
        await fetch(`${API_URL}?api=insert`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ key: selectedMonth, folder: 'agenda', estructura: [] }) 
        });
    } catch (error) {
        console.error('Error creating empty records:', error);
    }
}
