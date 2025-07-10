from typing import List, Optional, Tuple
from ...src.schemas import GoGameState


def initialize_game_state() -> GoGameState:
    """Инициализация игрового состояния для ГО"""
    board = [[None for _ in range(9)] for _ in range(9)]
    return GoGameState(
        board=board,
        current_player="black",
        captured_black=0,
        captured_white=0,
        last_move=None,
        ko_protection=None,
        is_game_over=False,
        winner=None
    )


def get_group_and_liberties(board: List[List[Optional[str]]], x: int, y: int) -> Tuple[List[Tuple[int, int]], int]:
    """Получить группу камней и количество свобод"""
    color = board[x][y]
    if color is None:
        return [], 0

    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    visited = set()
    queue = [(x, y)]
    group = []
    liberties = set()

    while queue:
        cx, cy = queue.pop(0)
        key = f"{cx},{cy}"

        if key in visited:
            continue
        visited.add(key)
        group.append((cx, cy))

        for dx, dy in directions:
            nx, ny = cx + dx, cy + dy

            if 0 <= nx < 9 and 0 <= ny < 9:
                if board[nx][ny] is None:
                    liberties.add(f"{nx},{ny}")
                elif board[nx][ny] == color:
                    queue.append((nx, ny))

    return group, len(liberties)


def is_valid_move(game_state: GoGameState, player_color: str, x: int, y: int) -> bool:
    """Проверка валидности хода"""
    # Проверка границ
    if x < 0 or x >= 9 or y < 0 or y >= 9:
        return False

    # Проверка, что клетка свободна
    if game_state.board[x][y] is not None:
        return False

    # Проверка правила ко
    if game_state.ko_protection:
        # Создаем временную доску для проверки
        temp_board = [row[:] for row in game_state.board]
        temp_board[x][y] = player_color
        
        # Удаляем захваченные камни
        opponent = "white" if player_color == "black" else "black"
        captured_stones = 0
        
        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < 9 and 0 <= ny < 9 and temp_board[nx][ny] == opponent:
                group, liberties = get_group_and_liberties(temp_board, nx, ny)
                if liberties == 0:
                    captured_stones += len(group)
                    for gx, gy in group:
                        temp_board[gx][gy] = None

        # Проверяем, не повторяется ли позиция
        if temp_board == game_state.ko_protection and captured_stones == 1:
            return False

    return True


def make_move(game_state: GoGameState, player_color: str, x: int, y: int) -> GoGameState:
    """Выполнить ход в игре ГО"""
    if not is_valid_move(game_state, player_color, x, y):
        raise ValueError("Invalid move")

    # Создаем копию состояния
    new_state = GoGameState(
        board=[row[:] for row in game_state.board],
        current_player=game_state.current_player,
        captured_black=game_state.captured_black,
        captured_white=game_state.captured_white,
        last_move=game_state.last_move,
        ko_protection=game_state.ko_protection,
        is_game_over=game_state.is_game_over,
        winner=game_state.winner
    )

    # Размещаем камень
    new_state.board[x][y] = player_color
    new_state.last_move = [x, y]

    # Проверяем захват камней противника
    opponent = "white" if player_color == "black" else "black"
    captured_stones = 0
    captured_groups = []

    for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
        nx, ny = x + dx, y + dy
        if 0 <= nx < 9 and 0 <= ny < 9 and new_state.board[nx][ny] == opponent:
            group, liberties = get_group_and_liberties(new_state.board, nx, ny)
            if liberties == 0:
                captured_stones += len(group)
                captured_groups.append(group)

    # Удаляем захваченные камни
    for group in captured_groups:
        for gx, gy in group:
            new_state.board[gx][gy] = None

    # Проверяем самоубийственный ход
    group, liberties = get_group_and_liberties(new_state.board, x, y)
    if liberties == 0 and captured_stones == 0:
        raise ValueError("Suicide move not allowed")

    # Обновляем счет захваченных камней
    if player_color == "black":
        new_state.captured_black += captured_stones
    else:
        new_state.captured_white += captured_stones

    # Устанавливаем защиту от ко
    if captured_stones == 1:
        new_state.ko_protection = [row[:] for row in game_state.board]
    else:
        new_state.ko_protection = None

    # Передаем ход следующему игроку
    new_state.current_player = "white" if player_color == "black" else "black"

    return new_state


def check_game_end(game_state: GoGameState) -> GoGameState:
    """Проверка окончания игры (упрощенная версия)"""
    # В реальной игре ГО есть более сложные правила окончания
    # Здесь просто проверяем, есть ли возможность хода
    new_state = GoGameState(
        board=game_state.board,
        current_player=game_state.current_player,
        captured_black=game_state.captured_black,
        captured_white=game_state.captured_white,
        last_move=game_state.last_move,
        ko_protection=game_state.ko_protection,
        is_game_over=game_state.is_game_over,
        winner=game_state.winner
    )

    # Проверяем, может ли текущий игрок сделать ход
    can_move = False
    for x in range(9):
        for y in range(9):
            if is_valid_move(new_state, new_state.current_player, x, y):
                can_move = True
                break
        if can_move:
            break

    if not can_move:
        new_state.is_game_over = True
        # Определяем победителя по количеству захваченных камней
        if new_state.captured_black > new_state.captured_white:
            new_state.winner = "black"
        elif new_state.captured_white > new_state.captured_black:
            new_state.winner = "white"
        else:
            new_state.winner = "draw"

    return new_state 