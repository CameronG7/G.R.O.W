export const getSavedPlantIds = () => {
  const savedPlantIds = localStorage.getItem('saved_plants')
    ? JSON.parse(localStorage.getItem('saved_plants'))
    : [];

  return savedPlantIds;
};

export const savePlantIds = (plantIdArr) => {
  if (plantIdArr.length) {
    localStorage.setItem('saved_plants', JSON.stringify(plantIdArr));
  } else {
    localStorage.removeItem('saved_plants');
  }
};

export const removePlantId = (plantId) => {
  const savedPlantIds = localStorage.getItem('saved_plants')
    ? JSON.parse(localStorage.getItem('saved_plants'))
    : null;

  if (!savedPlantIds) {
    return false;
  }

  const updatedSavedPlantIds = savedPlantIds?.filter((savedPlantId) => savedPlantId !== plantId);
  localStorage.setItem('saved_plants', JSON.stringify(updatedSavedPlantIds));

  return true;
};
