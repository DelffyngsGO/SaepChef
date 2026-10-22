import { Router } from "express";
import { usuarioController } from "../Controller/usuarioController.js";

const router = Router();


router.post("/login", usuarioController.getByLogin);
router.post("/", usuarioController.create);
router.get("/", usuarioController.findAll);
router.get("/:id", usuarioController.findById);
router.put("/:id", usuarioController.update);
router.delete("/:id", usuarioController.delete);

export default router;