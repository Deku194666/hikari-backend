import Pet from "../models/Pet.js";

// crear mascota
export const createPet = async (req, res) => {
  try {
    const { name, type, breed, age, weight, sex } = req.body;

    const pet = await Pet.create({
      name,
      type,
      breed,
      age,
      weight,
      sex,
      owner: req.user._id
    });

    res.json(pet);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// obtener mascotas del usuario
export const getPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ msg: "Mascota no encontrada" });
    }

    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    await pet.deleteOne();

    res.json({ msg: "Mascota eliminada 🗑" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ msg: "Mascota no encontrada" });
    }

    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    const { name, type, breed, age, weight, sex } = req.body;

    pet.name = name || pet.name;
    pet.type = type || pet.type;
    pet.breed = breed || pet.breed;
    pet.age = age || pet.age;
    pet.weight = weight || pet.weight;
    pet.sex = sex || pet.sex;

    const updatedPet = await pet.save();

    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// vet ve todas las mascotas (pacientes) de todos los dueños
export const getAllPatients = async (req, res) => {
  try {
    const pets = await Pet.find({}).populate("owner", "name email phone");
    res.json(pets);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};