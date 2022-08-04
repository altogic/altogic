"use strict";
/*
React-Quill
https://github.com/zenoamaro/react-quill
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var react_1 = __importDefault(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var isEqual_1 = __importDefault(require("lodash/isEqual"));
var quill_1 = __importDefault(require("quill"));
var ReactQuill = /** @class */ (function (_super) {
    __extends(ReactQuill, _super);
    function ReactQuill(props) {
        var _this = _super.call(this, props) || this;
        /*
        Changing one of these props should cause a full re-render and a
        re-instantiation of the Quill editor.
        */
        _this.dirtyProps = [
            'modules',
            'formats',
            'bounds',
            'theme',
            'children',
        ];
        /*
        Changing one of these props should cause a regular update. These are mostly
        props that act on the container, rather than the quillized editing area.
        */
        _this.cleanProps = [
            'id',
            'className',
            'style',
            'placeholder',
            'tabIndex',
            'onChange',
            'onChangeSelection',
            'onFocus',
            'onBlur',
            'onKeyPress',
            'onKeyDown',
            'onKeyUp',
        ];
        _this.state = {
            generation: 0,
        };
        /*
        Tracks the internal selection of the Quill editor
        */
        _this.selection = null;
        _this.onEditorChange = function (eventName, rangeOrDelta, oldRangeOrDelta, source) {
            var _a, _b, _c, _d;
            if (eventName === 'text-change') {
                (_b = (_a = _this).onEditorChangeText) === null || _b === void 0 ? void 0 : _b.call(_a, _this.editor.root.innerHTML, rangeOrDelta, source, _this.unprivilegedEditor);
            }
            else if (eventName === 'selection-change') {
                (_d = (_c = _this).onEditorChangeSelection) === null || _d === void 0 ? void 0 : _d.call(_c, rangeOrDelta, source, _this.unprivilegedEditor);
            }
        };
        var value = _this.isControlled() ? props.value : props.defaultValue;
        _this.value = (value !== null && value !== void 0 ? value : '');
        return _this;
    }
    ReactQuill.prototype.validateProps = function (props) {
        var _a;
        if (react_1.default.Children.count(props.children) > 1)
            throw new Error('The Quill editing area can only be composed of a single React element.');
        if (react_1.default.Children.count(props.children)) {
            var child = react_1.default.Children.only(props.children);
            if (((_a = child) === null || _a === void 0 ? void 0 : _a.type) === 'textarea')
                throw new Error('Quill does not support editing on a <textarea>. Use a <div> instead.');
        }
        if (this.lastDeltaChangeSet &&
            props.value === this.lastDeltaChangeSet)
            throw new Error('You are passing the `delta` object from the `onChange` event back ' +
                'as `value`. You most probably want `editor.getContents()` instead. ' +
                'See: https://github.com/zenoamaro/react-quill#using-deltas');
    };
    ReactQuill.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        var _this = this;
        var _a;
        this.validateProps(nextProps);
        // If the editor hasn't been instantiated yet, or the component has been
        // regenerated, we already know we should update.
        if (!this.editor || this.state.generation !== nextState.generation) {
            return true;
        }
        // Handle value changes in-place
        if ('value' in nextProps) {
            var prevContents = this.getEditorContents();
            var nextContents = (_a = nextProps.value, (_a !== null && _a !== void 0 ? _a : ''));
            // NOTE: Seeing that Quill is missing a way to prevent edits, we have to
            //       settle for a hybrid between controlled and uncontrolled mode. We
            //       can't prevent the change, but we'll still override content
            //       whenever `value` differs from current state.
            // NOTE: Comparing an HTML string and a Quill Delta will always trigger a
            //       change, regardless of whether they represent the same document.
            if (!this.isEqualValue(nextContents, prevContents)) {
                this.setEditorContents(this.editor, nextContents);
            }
        }
        // Handle read-only changes in-place
        if (nextProps.readOnly !== this.props.readOnly) {
            this.setEditorReadOnly(this.editor, nextProps.readOnly);
        }
        // Clean and Dirty props require a render
        return __spreadArrays(this.cleanProps, this.dirtyProps).some(function (prop) {
            return !isEqual_1.default(nextProps[prop], _this.props[prop]);
        });
    };
    ReactQuill.prototype.shouldComponentRegenerate = function (nextProps) {
        var _this = this;
        // Whenever a `dirtyProp` changes, the editor needs reinstantiation.
        return this.dirtyProps.some(function (prop) {
            return !isEqual_1.default(nextProps[prop], _this.props[prop]);
        });
    };
    ReactQuill.prototype.componentDidMount = function () {
        this.instantiateEditor();
        this.setEditorContents(this.editor, this.getEditorContents());
    };
    ReactQuill.prototype.componentWillUnmount = function () {
        this.destroyEditor();
    };
    ReactQuill.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _this = this;
        // If we're changing one of the `dirtyProps`, the entire Quill Editor needs
        // to be re-instantiated. Regenerating the editor will cause the whole tree,
        // including the container, to be cleaned up and re-rendered from scratch.
        // Store the contents so they can be restored later.
        if (this.editor && this.shouldComponentRegenerate(prevProps)) {
            var delta = this.editor.getContents();
            var selection = this.editor.getSelection();
            this.regenerationSnapshot = { delta: delta, selection: selection };
            this.setState({ generation: this.state.generation + 1 });
            this.destroyEditor();
        }
        // The component has been regenerated, so it must be re-instantiated, and
        // its content must be restored to the previous values from the snapshot.
        if (this.state.generation !== prevState.generation) {
            var _a = this.regenerationSnapshot, delta = _a.delta, selection_1 = _a.selection;
            delete this.regenerationSnapshot;
            this.instantiateEditor();
            var editor_1 = this.editor;
            editor_1.setContents(delta);
            postpone(function () { return _this.setEditorSelection(editor_1, selection_1); });
        }
    };
    ReactQuill.prototype.instantiateEditor = function () {
        if (this.editor)
            return;
        this.editor = this.createEditor(this.getEditingArea(), this.getEditorConfig());
    };
    ReactQuill.prototype.destroyEditor = function () {
        if (!this.editor)
            return;
        this.unhookEditor(this.editor);
        delete this.editor;
    };
    /*
    We consider the component to be controlled if `value` is being sent in props.
    */
    ReactQuill.prototype.isControlled = function () {
        return 'value' in this.props;
    };
    ReactQuill.prototype.getEditorConfig = function () {
        return {
            bounds: this.props.bounds,
            formats: this.props.formats,
            modules: this.props.modules,
            placeholder: this.props.placeholder,
            readOnly: this.props.readOnly,
            scrollingContainer: this.props.scrollingContainer,
            tabIndex: this.props.tabIndex,
            theme: this.props.theme,
        };
    };
    ReactQuill.prototype.getEditor = function () {
        if (!this.editor)
            throw new Error('Accessing non-instantiated editor');
        return this.editor;
    };
    /**
    Creates an editor on the given element. The editor will be passed the
    configuration, have its events bound,
    */
    ReactQuill.prototype.createEditor = function (element, config) {
        var editor = new quill_1.default(element, config);
        if (config.tabIndex != null) {
            this.setEditorTabIndex(editor, config.tabIndex);
        }
        this.hookEditor(editor);
        return editor;
    };
    ReactQuill.prototype.hookEditor = function (editor) {
        // Expose the editor on change events via a weaker, unprivileged proxy
        // object that does not allow accidentally modifying editor state.
        this.unprivilegedEditor = this.makeUnprivilegedEditor(editor);
        // Using `editor-change` allows picking up silent updates, like selection
        // changes on typing.
        editor.on('editor-change', this.onEditorChange);
    };
    ReactQuill.prototype.unhookEditor = function (editor) {
        editor.off('editor-change', this.onEditorChange);
    };
    ReactQuill.prototype.getEditorContents = function () {
        return this.value;
    };
    ReactQuill.prototype.getEditorSelection = function () {
        return this.selection;
    };
    /*
    True if the value is a Delta instance or a Delta look-alike.
    */
    ReactQuill.prototype.isDelta = function (value) {
        return value && value.ops;
    };
    /*
    Special comparison function that knows how to compare Deltas.
    */
    ReactQuill.prototype.isEqualValue = function (value, nextValue) {
        if (this.isDelta(value) && this.isDelta(nextValue)) {
            return isEqual_1.default(value.ops, nextValue.ops);
        }
        else {
            return isEqual_1.default(value, nextValue);
        }
    };
    /*
    Replace the contents of the editor, but keep the previous selection hanging
    around so that the cursor won't move.
    */
    ReactQuill.prototype.setEditorContents = function (editor, value) {
        var _this = this;
        this.value = value;
        var sel = this.getEditorSelection();
        if (typeof value === 'string') {
            editor.setContents(editor.clipboard.convert(value));
        }
        else {
            editor.setContents(value);
        }
        postpone(function () { return _this.setEditorSelection(editor, sel); });
    };
    ReactQuill.prototype.setEditorSelection = function (editor, range) {
        this.selection = range;
        if (range) {
            // Validate bounds before applying.
            var length_1 = editor.getLength();
            range.index = Math.max(0, Math.min(range.index, length_1 - 1));
            range.length = Math.max(0, Math.min(range.length, (length_1 - 1) - range.index));
            editor.setSelection(range);
        }
    };
    ReactQuill.prototype.setEditorTabIndex = function (editor, tabIndex) {
        var _a, _b;
        if ((_b = (_a = editor) === null || _a === void 0 ? void 0 : _a.scroll) === null || _b === void 0 ? void 0 : _b.domNode) {
            editor.scroll.domNode.tabIndex = tabIndex;
        }
    };
    ReactQuill.prototype.setEditorReadOnly = function (editor, value) {
        if (value) {
            editor.disable();
        }
        else {
            editor.enable();
        }
    };
    /*
    Returns a weaker, unprivileged proxy object that only exposes read-only
    accessors found on the editor instance, without any state-modifying methods.
    */
    ReactQuill.prototype.makeUnprivilegedEditor = function (editor) {
        var e = editor;
        return {
            getHTML: function () { return e.root.innerHTML; },
            getLength: e.getLength.bind(e),
            getText: e.getText.bind(e),
            getContents: e.getContents.bind(e),
            getSelection: e.getSelection.bind(e),
            getBounds: e.getBounds.bind(e),
        };
    };
    ReactQuill.prototype.getEditingArea = function () {
        if (!this.editingArea) {
            throw new Error('Instantiating on missing editing area');
        }
        var element = react_dom_1.default.findDOMNode(this.editingArea);
        if (!element) {
            throw new Error('Cannot find element for editing area');
        }
        if (element.nodeType === 3) {
            throw new Error('Editing area cannot be a text node');
        }
        return element;
    };
    /*
    Renders an editor area, unless it has been provided one to clone.
    */
    ReactQuill.prototype.renderEditingArea = function () {
        var _this = this;
        var _a = this.props, children = _a.children, preserveWhitespace = _a.preserveWhitespace;
        var generation = this.state.generation;
        var properties = {
            key: generation,
            ref: function (instance) {
                _this.editingArea = instance;
            },
        };
        if (react_1.default.Children.count(children)) {
            return react_1.default.cloneElement(react_1.default.Children.only(children), properties);
        }
        return preserveWhitespace ?
            react_1.default.createElement("pre", __assign({}, properties)) :
            react_1.default.createElement("div", __assign({}, properties));
    };
    ReactQuill.prototype.render = function () {
        var _a;
        return (react_1.default.createElement("div", { id: this.props.id, style: this.props.style, key: this.state.generation, className: "quill " + (_a = this.props.className, (_a !== null && _a !== void 0 ? _a : '')), onKeyPress: this.props.onKeyPress, onKeyDown: this.props.onKeyDown, onKeyUp: this.props.onKeyUp }, this.renderEditingArea()));
    };
    ReactQuill.prototype.onEditorChangeText = function (value, delta, source, editor) {
        var _a, _b;
        if (!this.editor)
            return;
        // We keep storing the same type of value as what the user gives us,
        // so that value comparisons will be more stable and predictable.
        var nextContents = this.isDelta(this.value)
            ? editor.getContents()
            : editor.getHTML();
        if (nextContents !== this.getEditorContents()) {
            // Taint this `delta` object, so we can recognize whether the user
            // is trying to send it back as `value`, preventing a likely loop.
            this.lastDeltaChangeSet = delta;
            this.value = nextContents;
            (_b = (_a = this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, value, delta, source, editor);
        }
    };
    ReactQuill.prototype.onEditorChangeSelection = function (nextSelection, source, editor) {
        var _a, _b, _c, _d, _e, _f;
        if (!this.editor)
            return;
        var currentSelection = this.getEditorSelection();
        var hasGainedFocus = !currentSelection && nextSelection;
        var hasLostFocus = currentSelection && !nextSelection;
        if (isEqual_1.default(nextSelection, currentSelection))
            return;
        this.selection = nextSelection;
        (_b = (_a = this.props).onChangeSelection) === null || _b === void 0 ? void 0 : _b.call(_a, nextSelection, source, editor);
        if (hasGainedFocus) {
            (_d = (_c = this.props).onFocus) === null || _d === void 0 ? void 0 : _d.call(_c, nextSelection, source, editor);
        }
        else if (hasLostFocus) {
            (_f = (_e = this.props).onBlur) === null || _f === void 0 ? void 0 : _f.call(_e, currentSelection, source, editor);
        }
    };
    ReactQuill.prototype.focus = function () {
        if (!this.editor)
            return;
        this.editor.focus();
    };
    ReactQuill.prototype.blur = function () {
        if (!this.editor)
            return;
        this.selection = null;
        this.editor.blur();
    };
    ReactQuill.displayName = 'React Quill';
    /*
    Export Quill to be able to call `register`
    */
    ReactQuill.Quill = quill_1.default;
    ReactQuill.defaultProps = {
        theme: 'snow',
        modules: {},
        readOnly: false,
    };
    return ReactQuill;
}(react_1.default.Component));
/*
Small helper to execute a function in the next micro-tick.
*/
function postpone(fn) {
    Promise.resolve().then(fn);
}
module.exports = ReactQuill;
//# sourceMappingURL=index.js.map