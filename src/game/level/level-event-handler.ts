import { closestLowerValue } from "@/utils/math";
import { TILE_HEIGHT, TILE_WIDTH, type Board } from "../board";
import { GameScene } from "../game";
import { isPointInRect, type Button } from "../helpers/canvas";
import {
  createModal,
  getModalButtonRect,
  isPointerInModalCloseArea,
} from "../modal";
import { SeedPacketStatus, type SeedSlotManager } from "../seed";
import { PlantInfo } from "../entities/plants";
import { createPlant } from "../entities/plants/service/create-plant";

import type { Cleanup } from "../types/cleanup";
import type { Vector2 } from "../types/math";
import type { LevelStore } from "./level-store";

export interface LevelEventHandler {
  start(board: Board): Cleanup;
}

type Options = {
  store: LevelStore;
  buttons: Button[];
  setScene(scene: GameScene): void;
};

enum ButtonId {
  Menu = "MENU",
}

enum ModalButtonId {
  ExitToMap = "EXIT_TO_MAP",
  Restart = "RESTART",
  Resume = "RESUME",
  Continue = "CONTINUE",
}

export function createLevelEventHandler(options: Options): LevelEventHandler {
  const { store, buttons, setScene } = options;
  const { state, actions } = store;

  function start(board: Board) {
    const { canvas } = board;

    function handlePointerDownEvent(e: PointerEvent) {
      const coords = board.getCanvasCoordinates(e);
      const activeModal = state.activeModal;

      if (activeModal !== null) {
        if (isPointerInModalCloseArea(activeModal, board, e)) {
          actions.setActiveModal(null);
          actions.setIsPaused(false);
          return;
        }

        const modalButton = activeModal.buttons.find((_, index) =>
          isPointInRect(coords, getModalButtonRect(index, activeModal.buttons)),
        );

        if (modalButton !== undefined) {
          handleModalButtonClick(modalButton.id, store, setScene);
        }
      }
      if (state.isPaused) {
        return;
      }
      if (
        state.rewardPacket !== null &&
        isPointInRect(coords, {
          x: state.rewardPacket.position.x,
          y: state.rewardPacket.position.y,
          width: state.rewardPacket.size.width,
          height: state.rewardPacket.size.height,
        })
      ) {
        const modal = createModal({
          title: "Reward",
          description: state.rewardPacket.plantType,
          buttons: [
            {
              id: ModalButtonId.Continue,
              text: "Continue",
            },
          ],
        });
        actions.setActiveModal(modal);
        return;
      }
      if (!state.gameOver) {
        handleSunCollect(store, board, e, coords);
        handleSeedSlotSelect(state.seedSlotManager, coords);
        handlePlacePlant(store, board, e, coords);
      }

      const button = buttons.find((btn) => isPointInRect(coords, btn));

      if (button !== undefined) {
        handleButtonClick(button.id, store);
      }
    }

    canvas.addEventListener("pointerdown", handlePointerDownEvent);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDownEvent);
    };
  }

  return {
    start,
  };
}

function handleSunCollect(
  store: LevelStore,
  board: Board,
  e: PointerEvent,
  coords: Vector2,
) {
  const { state, actions } = store;

  if (state.suns.length <= 0) {
    return;
  }
  if (!board.isPointerInPlaySafeArea(e)) {
    return;
  }

  const sun = state.suns.find((sun) =>
    isPointInRect(coords, {
      x: sun.position.x,
      y: sun.position.y,
      width: sun.size.width,
      height: sun.size.height,
    }),
  );

  if (sun === undefined) {
    return;
  }

  actions.setSunAmount(state.sunAmount + sun.amount);
  actions.removeSunById(sun.id);
}

function handleSeedSlotSelect(
  seedSlotManager: SeedSlotManager,
  coords: Vector2,
) {
  if (
    !isPointInRect(coords, {
      x: seedSlotManager.position.x,
      y: seedSlotManager.position.y,
      width: seedSlotManager.size.width,
      height: seedSlotManager.size.height,
    })
  ) {
    return;
  }

  // FIXME: This logic is problematic
  const selectedSlotId = seedSlotManager.selectedSlot?.id;
  const seedSlot = seedSlotManager.slots.find((slot) =>
    isPointInRect(coords, slot),
  );

  if (seedSlot === undefined) {
    return;
  }
  if (seedSlot.id === selectedSlotId) {
    seedSlotManager.setSelectedSlot(null);
  } else {
    seedSlotManager.setSelectedSlot(seedSlot);
  }
}

function handlePlacePlant(
  store: LevelStore,
  board: Board,
  e: PointerEvent,
  coords: Vector2,
) {
  const { state, actions } = store;
  const { selectedSlot } = state.seedSlotManager;

  if (selectedSlot === null) {
    return;
  }

  const inPlaySafeArea = board.isPointerInPlaySafeArea(e);

  if (!inPlaySafeArea) {
    return;
  }
  if (selectedSlot.packet.status === SeedPacketStatus.Disabled) {
    return;
  }

  const closestX = closestLowerValue(
    coords.x,
    board.tilePosList.map((tilePos) => tilePos.x),
  );
  const closestY = closestLowerValue(
    coords.y,
    board.tilePosList.map((tilePos) => tilePos.y),
  );
  const closestPlant = state.plants.find((plant) => {
    return (
      plant.position.x >= closestX &&
      plant.position.x <= closestX + TILE_WIDTH &&
      plant.position.y >= closestY &&
      plant.position.y <= closestY + TILE_HEIGHT
    );
  });

  if (closestPlant !== undefined) {
    return;
  }

  const plantType = selectedSlot.packet.plantType;
  const plantCost = PlantInfo[plantType].SunCost;

  if (state.sunAmount < plantCost) {
    return;
  }

  const plant = createPlant(plantType, closestX, closestY, store);

  if (plant !== null) {
    actions.addPlant(plant);
  }

  selectedSlot.packet.setCooldownTimerPaused(false);
  state.seedSlotManager.setSelectedSlot(null);
  actions.setSunAmount(state.sunAmount - plantCost);
}

function handleButtonClick(id: string, store: LevelStore) {
  const { actions } = store;

  switch (id) {
    case ButtonId.Menu:
      const modal = createModal({
        title: "Game Paused",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro sequi voluptatibus quasi expedita veniam explicabo optio impedit, repudiandae doloremque enim hic placeat eos. Mollitia ullam quasi molestias voluptates consectetur ratione.",
        buttons: [
          {
            id: ModalButtonId.ExitToMap,
            text: "Exit To Map",
          },
          {
            id: ModalButtonId.Restart,
            text: "Restart",
          },
          {
            id: ModalButtonId.Resume,
            text: "Resume",
          },
        ],
      });
      actions.setActiveModal(modal);
      actions.setIsPaused(true);
      break;
  }
}

function handleModalButtonClick(
  id: string,
  store: LevelStore,
  setScene: (scene: GameScene) => void,
) {
  const { actions } = store;

  switch (id) {
    case ModalButtonId.ExitToMap:
      setScene(GameScene.MainMenu);
      break;

    case ModalButtonId.Resume:
      actions.setActiveModal(null);
      actions.setIsPaused(false);
      break;
  }
}
