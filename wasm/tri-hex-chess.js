
let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder, inspect } = require(`util`);

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}
/**
 * Color of the Player. Called 'Color' instead of 'Player' to
 * clearly differentiate from the 'PieceType' enum (same first letter)
 * @enum {0 | 1 | 2}
 */
module.exports.Color = Object.freeze({
    White: 0, "0": "White",
    Gray: 1, "1": "Gray",
    Black: 2, "2": "Black",
});
/**
 * All possible move types
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}
 */
module.exports.MoveType = Object.freeze({
    Move: 0, "0": "Move",
    DoublePawnPush: 1, "1": "DoublePawnPush",
    Capture: 2, "2": "Capture",
    EnPassant: 3, "3": "EnPassant",
    EnPassantPromotion: 4, "4": "EnPassantPromotion",
    Promotion: 5, "5": "Promotion",
    CapturePromotion: 6, "6": "CapturePromotion",
    CastleKingSide: 7, "7": "CastleKingSide",
    CastleQueenSide: 8, "8": "CastleQueenSide",
});
/**
 * Chess piece representation
 * @enum {1 | 2 | 3 | 4 | 5 | 6}
 */
module.exports.Piece = Object.freeze({
    Pawn: 1, "1": "Pawn",
    Knight: 2, "2": "Knight",
    Bishop: 3, "3": "Bishop",
    Rook: 4, "4": "Rook",
    Queen: 5, "5": "Queen",
    King: 6, "6": "King",
});

const AttackInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_attackinfo_free(ptr >>> 0, 1));
/**
 * Represents an attack on the king by a piece
 */
class AttackInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AttackInfo.prototype);
        obj.__wbg_ptr = ptr;
        AttackInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AttackInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_attackinfo_free(ptr, 0);
    }
    /**
     * Position of the attacking piece
     * @returns {Coordinates}
     */
    get attack() {
        const ret = wasm.__wbg_get_attackinfo_attack(this.__wbg_ptr);
        return Coordinates.__wrap(ret);
    }
    /**
     * Position of the attacking piece
     * @param {Coordinates} arg0
     */
    set attack(arg0) {
        _assertClass(arg0, Coordinates);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_attackinfo_attack(this.__wbg_ptr, ptr0);
    }
    /**
     * Position of the king who is being attacked
     * @returns {Coordinates}
     */
    get king() {
        const ret = wasm.__wbg_get_attackinfo_king(this.__wbg_ptr);
        return Coordinates.__wrap(ret);
    }
    /**
     * Position of the king who is being attacked
     * @param {Coordinates} arg0
     */
    set king(arg0) {
        _assertClass(arg0, Coordinates);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_attackinfo_king(this.__wbg_ptr, ptr0);
    }
    /**
     * The player who is being attacked
     * @returns {Color}
     */
    get player_attacked() {
        const ret = wasm.__wbg_get_attackinfo_player_attacked(this.__wbg_ptr);
        return ret;
    }
    /**
     * The player who is being attacked
     * @param {Color} arg0
     */
    set player_attacked(arg0) {
        wasm.__wbg_set_attackinfo_player_attacked(this.__wbg_ptr, arg0);
    }
}
module.exports.AttackInfo = AttackInfo;

const ChessPieceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_chesspiece_free(ptr >>> 0, 1));
/**
 * Represents a piece on the board
 */
class ChessPiece {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ChessPiece.prototype);
        obj.__wbg_ptr = ptr;
        ChessPieceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            piece: this.piece,
            player: this.player,
            coordinates: this.coordinates,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ChessPieceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_chesspiece_free(ptr, 0);
    }
    /**
     * @returns {Piece}
     */
    get piece() {
        const ret = wasm.__wbg_get_chesspiece_piece(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Piece} arg0
     */
    set piece(arg0) {
        wasm.__wbg_set_chesspiece_piece(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {Color}
     */
    get player() {
        const ret = wasm.__wbg_get_attackinfo_player_attacked(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Color} arg0
     */
    set player(arg0) {
        wasm.__wbg_set_attackinfo_player_attacked(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {Coordinates}
     */
    get coordinates() {
        const ret = wasm.__wbg_get_chesspiece_coordinates(this.__wbg_ptr);
        return Coordinates.__wrap(ret);
    }
    /**
     * @param {Coordinates} arg0
     */
    set coordinates(arg0) {
        _assertClass(arg0, Coordinates);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_chesspiece_coordinates(this.__wbg_ptr, ptr0);
    }
}
module.exports.ChessPiece = ChessPiece;

const CoordinatesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_coordinates_free(ptr >>> 0, 1));

class Coordinates {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Coordinates.prototype);
        obj.__wbg_ptr = ptr;
        CoordinatesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            i: this.i,
            q: this.q,
            r: this.r,
            s: this.s,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CoordinatesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_coordinates_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get i() {
        const ret = wasm.__wbg_get_coordinates_i(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set i(arg0) {
        wasm.__wbg_set_coordinates_i(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get q() {
        const ret = wasm.__wbg_get_coordinates_q(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set q(arg0) {
        wasm.__wbg_set_coordinates_q(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get r() {
        const ret = wasm.__wbg_get_coordinates_r(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set r(arg0) {
        wasm.__wbg_set_coordinates_r(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get s() {
        const ret = wasm.__wbg_get_coordinates_s(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set s(arg0) {
        wasm.__wbg_set_coordinates_s(this.__wbg_ptr, arg0);
    }
}
module.exports.Coordinates = Coordinates;

const GameFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_game_free(ptr >>> 0, 1));

class Game {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Game.prototype);
        obj.__wbg_ptr = ptr;
        GameFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GameFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_game_free(ptr, 0);
    }
    /**
     * Create a new game from a FEN string
     * @param {string} fen
     * @returns {Game}
     */
    static new(fen) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(fen, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.game_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Game.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Game}
     */
    static newDefault() {
        const ret = wasm.game_newDefault();
        return Game.__wrap(ret);
    }
    /**
     * Update the game state from a FEN string
     * @param {string} fen
     */
    setFen(fen) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(fen, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
            const len0 = WASM_VECTOR_LEN;
            wasm.game_setFen(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    getDebugState() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.game_getDebugState(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_0(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the FEN string of the current game state
     * @returns {string}
     */
    getFen() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.game_getFen(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_0(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get information about the current state of the game (who's turn it is, who won, etc)
     * @returns {GameState}
     */
    getGameState() {
        const ret = wasm.game_getGameState(this.__wbg_ptr);
        return GameState.__wrap(ret);
    }
    skipToNextPlayer() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.game_skipToNextPlayer(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Returns all the pieces present on the board
     * @returns {ChessPiece[]}
     */
    getPieces() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.game_getPieces(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_0(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Deletes the piece at the given coordinates
     * This is a debugging function, not meant to be used in a real game
     * @param {Coordinates} coordinates
     */
    deletePiece(coordinates) {
        _assertClass(coordinates, Coordinates);
        var ptr0 = coordinates.__destroy_into_raw();
        wasm.game_deletePiece(this.__wbg_ptr, ptr0);
    }
    /**
     * Calculates the material value for each player
     * @returns {MaterialCounter}
     */
    getMaterial() {
        const ret = wasm.game_getMaterial(this.__wbg_ptr);
        return MaterialCounter.__wrap(ret);
    }
    /**
     * A debug function that returns all the legal moves available in the current position and turn
     * @returns {Move[]}
     */
    queryAllMoves() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.game_queryAllMoves(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_0(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get information about which pieces are attacking the king
     * @returns {AttackInfo[]}
     */
    getCheckMetadata() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.game_getCheckMetadata(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_0(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Gets the legal moves available for the piece at the given coordinates
     * @param {Coordinates} from
     * @returns {Move[]}
     */
    queryMoves(from) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(from, Coordinates);
            var ptr0 = from.__destroy_into_raw();
            wasm.game_queryMoves(retptr, this.__wbg_ptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v2 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_0(r0, r1 * 4, 4);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Commits the move to the game state
     * If the move is a promotion it requires a promotion piece
     * * `advance_turn` - If true, the turn will be advanced. Should be set to `true`
     * @param {Move} m
     * @param {Piece | null | undefined} promotion
     * @param {boolean} advance_turn
     */
    commitMove(m, promotion, advance_turn) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(m, Move);
            wasm.game_commitMove(retptr, this.__wbg_ptr, m.__wbg_ptr, isLikeNone(promotion) ? 0 : promotion, advance_turn);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.Game = Game;

const GameStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_gamestate_free(ptr >>> 0, 1));

class GameState {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GameState.prototype);
        obj.__wbg_ptr = ptr;
        GameStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GameStateFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_gamestate_free(ptr, 0);
    }
    /**
     * Who's turn it is
     * @returns {Color}
     */
    get turn() {
        const ret = wasm.__wbg_get_gamestate_turn(this.__wbg_ptr);
        return ret;
    }
    /**
     * Who's turn it is
     * @param {Color} arg0
     */
    set turn(arg0) {
        wasm.__wbg_set_gamestate_turn(this.__wbg_ptr, arg0);
    }
    /**
     * Who won the game, undefined if the game is ongoing
     * @returns {Color | undefined}
     */
    get won() {
        const ret = wasm.__wbg_get_gamestate_won(this.__wbg_ptr);
        return ret === 3 ? undefined : ret;
    }
    /**
     * Who won the game, undefined if the game is ongoing
     * @param {Color | null} [arg0]
     */
    set won(arg0) {
        wasm.__wbg_set_gamestate_won(this.__wbg_ptr, isLikeNone(arg0) ? 3 : arg0);
    }
    /**
     * If the game is a stalemate
     * @returns {boolean}
     */
    get is_stalemate() {
        const ret = wasm.__wbg_get_gamestate_is_stalemate(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * If the game is a stalemate
     * @param {boolean} arg0
     */
    set is_stalemate(arg0) {
        wasm.__wbg_set_gamestate_is_stalemate(this.__wbg_ptr, arg0);
    }
    /**
     * The number of moves that have been made
     * @returns {number}
     */
    get move_count() {
        const ret = wasm.__wbg_get_gamestate_move_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * The number of moves that have been made
     * @param {number} arg0
     */
    set move_count(arg0) {
        wasm.__wbg_set_gamestate_move_count(this.__wbg_ptr, arg0);
    }
    /**
     * The number of 'third moves' since the last capture or pawn move
     * @returns {number}
     */
    get third_move_count() {
        const ret = wasm.__wbg_get_gamestate_third_move_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * The number of 'third moves' since the last capture or pawn move
     * @param {number} arg0
     */
    set third_move_count(arg0) {
        wasm.__wbg_set_gamestate_third_move_count(this.__wbg_ptr, arg0);
    }
}
module.exports.GameState = GameState;

const MaterialCounterFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_materialcounter_free(ptr >>> 0, 1));
/**
 * Represents the material value for each player
 * Queen: 9, Rook: 5, Bishop: 3, Knight: 3, Pawn: 1, King has no value
 * Starting material value for each player: 39
 */
class MaterialCounter {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MaterialCounter.prototype);
        obj.__wbg_ptr = ptr;
        MaterialCounterFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MaterialCounterFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_materialcounter_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get white() {
        const ret = wasm.__wbg_get_coordinates_i(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set white(arg0) {
        wasm.__wbg_set_coordinates_i(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get gray() {
        const ret = wasm.__wbg_get_materialcounter_gray(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set gray(arg0) {
        wasm.__wbg_set_coordinates_q(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get black() {
        const ret = wasm.__wbg_get_materialcounter_black(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set black(arg0) {
        wasm.__wbg_set_coordinates_r(this.__wbg_ptr, arg0);
    }
}
module.exports.MaterialCounter = MaterialCounter;

const MoveFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_move_free(ptr >>> 0, 1));

class Move {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Move.prototype);
        obj.__wbg_ptr = ptr;
        MoveFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MoveFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_move_free(ptr, 0);
    }
    /**
     * @returns {Coordinates}
     */
    get from() {
        const ret = wasm.__wbg_get_move_from(this.__wbg_ptr);
        return Coordinates.__wrap(ret);
    }
    /**
     * @param {Coordinates} arg0
     */
    set from(arg0) {
        _assertClass(arg0, Coordinates);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_move_from(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Coordinates}
     */
    get to() {
        const ret = wasm.__wbg_get_move_to(this.__wbg_ptr);
        return Coordinates.__wrap(ret);
    }
    /**
     * @param {Coordinates} arg0
     */
    set to(arg0) {
        _assertClass(arg0, Coordinates);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_move_to(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {MoveType}
     */
    get move_type() {
        const ret = wasm.__wbg_get_move_move_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {MoveType} arg0
     */
    set move_type(arg0) {
        wasm.__wbg_set_move_move_type(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {Color}
     */
    get color() {
        const ret = wasm.__wbg_get_move_color(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Color} arg0
     */
    set color(arg0) {
        wasm.__wbg_set_move_color(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {Piece}
     */
    get piece() {
        const ret = wasm.__wbg_get_move_piece(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Piece} arg0
     */
    set piece(arg0) {
        wasm.__wbg_set_move_piece(this.__wbg_ptr, arg0);
    }
}
module.exports.Move = Move;

module.exports.__wbg_attackinfo_new = function(arg0) {
    const ret = AttackInfo.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_chesspiece_new = function(arg0) {
    const ret = ChessPiece.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_export_0(deferred0_0, deferred0_1, 1);
    }
};

module.exports.__wbg_move_new = function(arg0) {
    const ret = Move.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_new_8a6f238a6ece86ea = function() {
    const ret = new Error();
    return addHeapObject(ret);
};

module.exports.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_1, wasm.__wbindgen_export_2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

const path = require('path').join(__dirname, 'tri-hex-chess_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

