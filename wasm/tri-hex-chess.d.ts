/* tslint:disable */
/* eslint-disable */
/**
 * Color of the Player. Called 'Color' instead of 'Player' to
 * clearly differentiate from the 'PieceType' enum (same first letter)
 */
export enum Color {
  White = 0,
  Gray = 1,
  Black = 2,
}
/**
 * All possible move types
 */
export enum MoveType {
  Move = 0,
  DoublePawnPush = 1,
  Capture = 2,
  EnPassant = 3,
  EnPassantPromotion = 4,
  Promotion = 5,
  CapturePromotion = 6,
  CastleKingSide = 7,
  CastleQueenSide = 8,
}
/**
 * Chess piece representation
 */
export enum Piece {
  Pawn = 1,
  Knight = 2,
  Bishop = 3,
  Rook = 4,
  Queen = 5,
  King = 6,
}
/**
 * Represents an attack on the king by a piece
 */
export class AttackInfo {
  private constructor();
  free(): void;
  /**
   * Position of the attacking piece
   */
  attack: Coordinates;
  /**
   * Position of the king who is being attacked
   */
  king: Coordinates;
  /**
   * The player who is being attacked
   */
  player_attacked: Color;
}
/**
 * Represents a piece on the board
 */
export class ChessPiece {
  private constructor();
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
  piece: Piece;
  player: Color;
  coordinates: Coordinates;
}
export class Coordinates {
  private constructor();
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
  i: number;
  q: number;
  r: number;
  s: number;
}
export class Game {
  private constructor();
  free(): void;
  /**
   * Create a new game from a FEN string
   */
  static new(fen: string): Game;
  static newDefault(): Game;
  /**
   * Update the game state from a FEN string
   */
  setFen(fen: string): void;
  getDebugState(): string;
  /**
   * Get the FEN string of the current game state
   */
  getFen(): string;
  /**
   * Get information about the current state of the game (who's turn it is, who won, etc)
   */
  getGameState(): GameState;
  skipToNextPlayer(): void;
  /**
   * Returns all the pieces present on the board
   */
  getPieces(): ChessPiece[];
  /**
   * Deletes the piece at the given coordinates
   * This is a debugging function, not meant to be used in a real game
   */
  deletePiece(coordinates: Coordinates): void;
  /**
   * Calculates the material value for each player
   */
  getMaterial(): MaterialCounter;
  /**
   * A debug function that returns all the legal moves available in the current position and turn
   */
  queryAllMoves(): Move[];
  /**
   * Get information about which pieces are attacking the king
   */
  getCheckMetadata(): AttackInfo[];
  /**
   * Gets the legal moves available for the piece at the given coordinates
   */
  queryMoves(from: Coordinates): Move[];
  /**
   * Commits the move to the game state
   * If the move is a promotion it requires a promotion piece
   * * `advance_turn` - If true, the turn will be advanced. Should be set to `true`
   */
  commitMove(m: Move, promotion: Piece | null | undefined, advance_turn: boolean): void;
}
export class GameState {
  private constructor();
  free(): void;
  /**
   * Who's turn it is
   */
  turn: Color;
  /**
   * Who won the game, undefined if the game is ongoing
   */
  get won(): Color | undefined;
  /**
   * Who won the game, undefined if the game is ongoing
   */
  set won(value: Color | null | undefined);
  /**
   * If the game is a stalemate
   */
  is_stalemate: boolean;
  /**
   * The number of moves that have been made
   */
  move_count: number;
  /**
   * The number of 'third moves' since the last capture or pawn move
   */
  third_move_count: number;
}
/**
 * Represents the material value for each player
 * Queen: 9, Rook: 5, Bishop: 3, Knight: 3, Pawn: 1, King has no value
 * Starting material value for each player: 39
 */
export class MaterialCounter {
  private constructor();
  free(): void;
  white: number;
  gray: number;
  black: number;
}
export class Move {
  private constructor();
  free(): void;
  from: Coordinates;
  to: Coordinates;
  move_type: MoveType;
  color: Color;
  piece: Piece;
}
