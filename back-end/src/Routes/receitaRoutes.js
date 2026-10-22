
import { Router } from "express";
import { receitaController } from "../Controller/receitaController.js";

const router = Router();

router.post("/", receitaController.create);
router.get("/", receitaController.findAll);
router.get("/:id", receitaController.findById);
router.put("/:id", receitaController.update);
router.delete("/:id", receitaController.delete);

export default router;
