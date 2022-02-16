import { useEffect, useState } from "react";
import Food, { TypeFood } from "../../components/Food";
import Header from "../../components/Header";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import api from "../../services/api";
import { FoodsContainer } from "./styles";

function Dashboard() {
  const [foods, setFoods] = useState<TypeFood[]>([]);
  const [editingFood, setEditingFood] = useState<TypeFood>({} as TypeFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      await api.get("/foods").then((foods) => setFoods(foods.data));
    }
    loadFoods();
  }, []);

  async function handleAddFood(food: TypeFood) {
    try {
      await api
        .post("/foods", {
          ...food,
          available: true,
        })
        .then((food) => setFoods([...foods, food.data]));
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: TypeFood) {
    try {
      const foodUpdated = await api
        .put(`/foods/${editingFood.id}`, {
          ...editingFood,
          ...food,
        })
        .then((foodUpdated) => {
          const foodsUpdated = foods.map((f) =>
            f.id !== foodUpdated.data.id ? f : foodUpdated.data
          );
          setFoods(foodsUpdated);
        });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food: TypeFood) => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: TypeFood) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
