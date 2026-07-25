import Walk from "../models/Walk.js";

// Iniciar una caminata
export const startWalk = async (req, res) => {
  try {
    const { userId, nombre, apellido, fecha } = req.body;

    const newWalk = await Walk.create({
      userId: req.userId, // viene del token verificado, no del body
      nombre,
      apellido,
      fecha: fecha ? new Date(fecha) : new Date(),
      startTime: new Date(),
      status: "en_curso",
    });

    res.status(201).json(newWalk);
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar la caminata", error: error.message });
  }
};

// Agregar un punto de ubicación
export const addPoint = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    const walk = await Walk.findById(id);
    if (!walk) return res.status(404).json({ message: "Caminata no encontrada" });

    walk.route.coordinates.push([longitude, latitude]);
    await walk.save();

    res.json(walk);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el punto", error: error.message });
  }
};

// Finalizar caminata
export const finishWalk = async (req, res) => {
  try {
    const { id } = req.params;

    const walk = await Walk.findById(id);
    if (!walk) return res.status(404).json({ message: "Caminata no encontrada" });

    walk.endTime = new Date();
    walk.status = "finalizada";
    walk.durationSeconds = Math.round((walk.endTime - walk.startTime) / 1000);

    // Calcular distancia total con fórmula de Haversine
    walk.distanceMeters = calculateDistance(walk.route.coordinates);

    await walk.save();
    res.json(walk);
  } catch (error) {
    res.status(500).json({ message: "Error al finalizar la caminata", error: error.message });
  }
};

// Listar caminatas de un usuario
export const getWalks = async (req, res) => {
  try {
    const walks = await Walk.find({ userId: req.userId }).sort({ startTime: -1 });
    res.json(walks);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las caminatas", error: error.message });
  }
};

// Obtener el detalle de una caminata
export const getWalkById = async (req, res) => {
  try {
    const { id } = req.params;
    const walk = await Walk.findById(id);
    if (!walk) return res.status(404).json({ message: "Caminata no encontrada" });
    res.json(walk);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la caminata", error: error.message });
  }
};

// Función auxiliar: distancia entre puntos GPS (Haversine)
function calculateDistance(coordinates) {
  if (coordinates.length < 2) return 0;

  let total = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const [lon1, lat1] = coordinates[i - 1];
    const [lon2, lat2] = coordinates[i];
    total += haversine(lat1, lon1, lat2, lon2);
  }
  return Math.round(total);
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000; // radio de la Tierra en metros
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}