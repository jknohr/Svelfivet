<svelte:options runes={true} />

<script lang="ts">
    import type { DrawerDirection, CSSColorString, AnchorProps, AnchorDrawerConfig } from '$lib/types';
    import { addProps } from '$lib/utils';
    import Icon from '$lib/assets/icons/Icon.svelte';

    let { children } = $props();

    // Replace stores with state
    let leftAnchorCount = $state(0);
    let rightAnchorCount = $state(0);
    let topAnchorCount = $state(0);
    let bottomAnchorCount = $state(0);
    let selfAnchorCount = $state(0);

    // Props for anchor creation with proper state declarations
    let invisible = $state<boolean | undefined>(undefined);
    let nodeConnect = $state<boolean | undefined>(undefined);
    let input = $state<boolean | undefined>(undefined);
    let output = $state<boolean | undefined>(undefined);
    let multiple = $state<boolean | undefined>(undefined);
    let direction = $state<DrawerDirection | undefined>(undefined);
    let dynamic = $state<boolean | undefined>(undefined);
    let anchorEdgeLabel = $state<string | undefined>(undefined);
    let anchorLocked = $state<boolean | undefined>(undefined);
    let anchorBgColor = $state<string | undefined>(undefined);
    let directionValue = $state<HTMLSelectElement | null>(null);
    let edgeProps = $state<any>(undefined);

    // Array of props for pending anchors based on direction
    let anchorsCreated = $state({
        self: [] as AnchorDrawerConfig[],
        left: [] as AnchorDrawerConfig[],
        right: [] as AnchorDrawerConfig[],
        top: [] as AnchorDrawerConfig[],
        bottom: [] as AnchorDrawerConfig[]
    });

    // Creates props and adds to corresponding anchor direction
    export function createAnchorProps(
        createAnchors: boolean,
        anchorPosition?: string
    ): { [key: string]: AnchorDrawerConfig[] } | undefined {
        // Skip empty direction values
        if (!direction) return;

        // Object that stores properties for the created anchor
        const anchorProps: AnchorDrawerConfig = {};
        // Array of property names and values for anchor
        const anchorPropNames: string[] = [
            'invisible',
            'nodeConnect',
            'input',
            'output',
            'multiple',
            'direction',
            'dynamic',
            'anchorEdgeLabel',
            'anchorLocked',
            'anchorBgColor',
            'edgeProps'
        ];
        const anchorPropsArray = [
            invisible,
            nodeConnect,
            input,
            output,
            multiple,
            direction,
            dynamic,
            anchorEdgeLabel,
            anchorLocked,
            anchorBgColor as CSSColorString,
            edgeProps
        ] as AnchorProps;

        // Add props to anchor if they exist
        addProps(anchorPropNames, anchorPropsArray, anchorProps);

        // If createAnchors is true, add anchor to corresponding direction
        if (createAnchors) {
            switch (direction) {
                case 'self':
                    selfAnchorCount++;
                    anchorsCreated.self = [...anchorsCreated.self, anchorProps];
                    break;
                case 'west':
                    leftAnchorCount++;
                    anchorsCreated.left = [...anchorsCreated.left, anchorProps];
                    break;
                case 'east':
                    rightAnchorCount++;
                    anchorsCreated.right = [...anchorsCreated.right, anchorProps];
                    break;
                case 'north':
                    topAnchorCount++;
                    anchorsCreated.top = [...anchorsCreated.top, anchorProps];
                    break;
                case 'south':
                    bottomAnchorCount++;
                    anchorsCreated.bottom = [...anchorsCreated.bottom, anchorProps];
                    break;
            }
        }

        return anchorsCreated;
    }

    // Button Clicks for Anchors
    const handleAnchorLockedButtonClick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        anchorLocked = target.checked;
    };

    const handleInvisibleButtonClick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        invisible = target.checked;
    };

    const handleNodeConnectButtonClick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        nodeConnect = target.checked;
    };

    const handleInputButtonClick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        input = target.checked;
    };

    const handleOutputButtonClick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        output = target.checked;
    };

    const handleMultipleButtonClick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        multiple = target.checked;
    };

    const handleDynamicButtonClick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        dynamic = target.checked;
    };

    const handleDirectionButtonClick = (e: Event) => {
        const target = e.target as HTMLSelectElement;
        if (target.value == '') direction = undefined;
        else {
            direction = target.value as DrawerDirection | undefined;
        }
    };
    // Reset props, pending anchors, and counters for position of anchors
    const handleAnchorResetButtonClick = (e: Event) => {
        invisible = undefined;
        nodeConnect = undefined;
        input = undefined;
        output = undefined;
        multiple = undefined;
        direction = undefined;
        dynamic = undefined;
        anchorEdgeLabel = undefined;
        anchorLocked = undefined;
        anchorBgColor = undefined;
        anchorsCreated.left = [];
        anchorsCreated.right = [];
        anchorsCreated.top = [];
        anchorsCreated.bottom = [];
        anchorsCreated.self = [];

        selfAnchorCount = 0;
        leftAnchorCount = 0;
        rightAnchorCount = 0;
        topAnchorCount = 0;
        bottomAnchorCount = 0;
        const formElement = e.target as HTMLFormElement;
        if (e) formElement.reset();
    };
    // Adds anchor based on the id of the button clicked
    const addAnchor = (e: Event) => {
        const formEvent = e.target as HTMLFormElement;
        const addAnchorID = formEvent?.parentElement?.id || formEvent?.id;
        direction = addAnchorID === 'addLeftAnchor' ? 'west' :
                   addAnchorID === 'addRightAnchor' ? 'east' :
                   addAnchorID === 'addTopAnchor' ? 'north' :
                   addAnchorID === 'addBottomAnchor' ? 'south' :
                   addAnchorID === 'addSelfAnchor' ? 'self' : undefined;
        
        if (direction) {
            createAnchorProps(true);
        }
    };
    // Deletes anchor based on the id of the button clicked
    const deleteAnchor = (e: Event) => {
        const formEvent = e.target as HTMLFormElement;
        const deleteAnchorID = formEvent?.parentElement?.id || formEvent?.id;

        if (deleteAnchorID === 'deleteLeftAnchor') {
            anchorsCreated.left.pop();
            leftAnchorCount = anchorsCreated.left.length;
        } else if (deleteAnchorID === 'deleteRightAnchor') {
            anchorsCreated.right.pop();
            rightAnchorCount = anchorsCreated.right.length;
        } else if (deleteAnchorID === 'deleteTopAnchor') {
            anchorsCreated.top.pop();
            topAnchorCount = anchorsCreated.top.length;
        } else if (deleteAnchorID === 'deleteBottomAnchor') {
            anchorsCreated.bottom.pop();
            bottomAnchorCount = anchorsCreated.bottom.length;
        } else if (deleteAnchorID === 'deleteSelfAnchor') {
            anchorsCreated.self.pop();
            selfAnchorCount = anchorsCreated.self.length;
        }
    };

    // Validation for anchor properties
    const validateAnchorProps = () => {
        if (invisible !== undefined && typeof invisible !== 'boolean') {
            throw new Error('Invalid value for invisible property');
        }
        if (nodeConnect !== undefined && typeof nodeConnect !== 'boolean') {
            throw new Error('Invalid value for nodeConnect property');
        }
        if (input !== undefined && typeof input !== 'boolean') {
            throw new Error('Invalid value for input property');
        }
        if (output !== undefined && typeof output !== 'boolean') {
            throw new Error('Invalid value for output property');
        }
        if (multiple !== undefined && typeof multiple !== 'boolean') {
            throw new Error('Invalid value for multiple property');
        }
        if (direction !== undefined && !['north', 'south', 'east', 'west', 'self'].includes(direction)) {
            throw new Error('Invalid value for direction property');
        }
        if (dynamic !== undefined && typeof dynamic !== 'boolean') {
            throw new Error('Invalid value for dynamic property');
        }
        if (anchorEdgeLabel !== undefined && typeof anchorEdgeLabel !== 'string') {
            throw new Error('Invalid value for anchorEdgeLabel property');
        }
        if (anchorLocked !== undefined && typeof anchorLocked !== 'boolean') {
            throw new Error('Invalid value for anchorLocked property');
        }
        if (anchorBgColor !== undefined && typeof anchorBgColor !== 'string') {
            throw new Error('Invalid value for anchorBgColor property');
        }
    };
</script>

<div id="anchorContainer">
    <!-- Replace any existing slots with {@render children()} -->
    {@render children?.()}
    <!-- On submit resets all the values on the input field in the form to default -->
    <form onreset={handleAnchorResetButtonClick}>
        <ul aria-labelledby="select_props">
            <li class="list-item">
                <label for="anchorBgColor">Background: </label>
                <input id="anchorBgColor" class="colorWheel" type="color" bind:value={anchorBgColor} />
            </li>
            <li class="list-item">
                <label for="invisible">Invisible: </label>
                <input
                    id="invisible"
                    type="checkbox"
                    bind:value={invisible}
                    onchange={handleInvisibleButtonClick}
                />
            </li>
            <li class="list-item">
                <label for="nodeConnect">Node Connect: </label>
                <input
                    id="nodeConnect"
                    type="checkbox"
                    bind:value={nodeConnect}
                    onchange={handleNodeConnectButtonClick}
                />
            </li>
            <li class="list-item">
                <label for="input">Input: </label>
                <input id="input" type="checkbox" bind:value={input} onchange={handleInputButtonClick} />
            </li>
            <li class="list-item">
                <label for="output">Output: </label>
                <input
                    id="output"
                    type="checkbox"
                    bind:value={output}
                    onchange={handleOutputButtonClick}
                />
            </li>
            <li class="list-item">
                <label for="multiple">Multiple: </label>
                <input
                    id="multiple"
                    type="checkbox"
                    bind:value={multiple}
                    onchange={handleMultipleButtonClick}
                />
            </li>
            <li class="list-item">
                <label for="direction">Direction: </label>
                <select
                    id="direction"
                    bind:this={directionValue}
                    bind:value={direction}
                    onchange={handleDirectionButtonClick}
                >
                    <option value="">-</option>
                    <option value="north">North</option>
                    <option value="south">South</option>
                    <option value="east">East</option>
                    <option value="west">West</option>
                    <option value="self">Self</option>
                </select>
            </li>
            <li class="list-item">
                <label for="dynamic">Dynamic: </label>
                <input
                    id="dynamic"
                    type="checkbox"
                    bind:value={dynamic}
                    onchange={handleDynamicButtonClick}
                />
            </li>

            <li class="list-item">
                <label for="anchorLocked">Locked: </label>
                <input
                    id="anchorLocked"
                    type="checkbox"
                    bind:value={anchorLocked}
                    onchange={handleAnchorLockedButtonClick}
                />
            </li>

            <li class="list-item">
                <label for="addAnchors"> Add Anchors: </label>
                <button
                    id="deleteSelfAnchor"
                    class="deleteAnchor"
                    type="button"
                    onclick={deleteAnchor}
                >
                    <Icon icon="arrow_left" />
                </button>
                <span class="list-item counter">{selfAnchorCount}</span>
                <button
                    id="addSelfAnchor"
                    class="addAnchor"
                    type="button"
                    onclick={addAnchor}
                >
                    <Icon icon="arrow_right" />
                </button>
            </li>
            <li class="list-item anchor-directions">
                <p>Left</p>
                <p>Right</p>
            </li>
            <li class="list-item anchor-directions">
                <button id="deleteLeftAnchor" class="deleteAnchor" type="button" onclick={deleteAnchor}>
                    <Icon icon="arrow_left" />
                </button>
                <span class="list-item counter">{leftAnchorCount}</span>
                <button id="addLeftAnchor" class="addAnchor" type="button" onclick={addAnchor}>
                    <Icon icon="arrow_right" />
                </button>
                <button id="deleteRightAnchor" class="deleteAnchor" type="button" onclick={deleteAnchor}>
                    <Icon icon="arrow_left" />
                </button>
                <span class="list-item counter">{rightAnchorCount}</span>
                <button id="addRightAnchor" class="addAnchor" type="button" onclick={addAnchor}>
                    <Icon icon="arrow_right" />
                </button>
            </li>
            <li class="list-item anchor-directions">
                <p>Top</p>
                <p>Bottom</p>
            </li>
            <li class="list-item anchor-directions">
                <button id="deleteTopAnchor" class="deleteAnchor" type="button" onclick={deleteAnchor}>
                    <Icon icon="arrow_left" />
                </button>
                <span class="list-item counter">{topAnchorCount}</span>
                <button id="addTopAnchor" class="addAnchor" type="button" onclick={addAnchor}>
                    <Icon icon="arrow_right" />
                </button>
                <button id="deleteBottomAnchor" class="deleteAnchor" type="button" onclick={deleteAnchor}>
                    <Icon icon="arrow_left" />
                </button>
                <span class="list-item counter">{bottomAnchorCount}</span>
                <button id="addBottomAnchor" class="addAnchor" type="button" onclick={addAnchor}>
                    <Icon icon="arrow_right" />
                </button>
            </li>
            <li class="list-item">
                <button class="anchorResetBtn btn" type="submit" aria-label="Reset">Reset</button>
            </li>
        </ul>
    </form>
</div>

<style>
    /* Anchor dropdown Styling */
    #anchorContainer {
        width: 100%;
        font-size: 15px;
    }
    #anchorContainer ul {
        margin: 0;
        padding: 0;
    }
    label {
        margin-right: 10px;
    }
    .list-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        list-style: none;
        margin-bottom: 10px;
        margin-right: 3px;
    }
    .colorWheel {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: transparent;
        border: none;
        width: 35px;
        height: 35px;
        cursor: pointer;
        border-radius: 50%;
    }

    .colorWheel::-webkit-color-swatch {
        border-radius: 40%;
    }
    .colorWheel::-moz-color-swatch {
        border-radius: 40%;
    }

    .btn {
        width: 120px;
        padding: 8px 20px;
        margin: auto;
        margin-top: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 15px;
        margin-left: 70px;
    }

    .addAnchor,
    .deleteAnchor {
        border: none;
        cursor: pointer;
        border-radius: 8px;
        padding: 5px;
        color: var(
            --prop-drawer-reset-button-text-color,
            var(--drawer-reset-button-text-color, var(--default-reset-drawer-button-text-color))
        );
        background-color: var(
            --prop-drawer-reset-button-color,
            var(--drawer-reset-button-color, var(--default-drawer-reset-button-color))
        );
        box-shadow: 0 0 0 var(--final-border-width) var(--final-border-color),
            var(--default-node-shadow);
    }

    .addAnchor:hover,
    .deleteAnchor:hover {
        color: var(
            --prop-drawer-reset-button-hover-text-color,
            var(
                --drawer-reset-button-hover-text-color,
                var(--default-drawer-reset-button-hover-text-color)
            )
        );
        background-color: var(
            --prop-drawer-reset-button-hover-color,
            var(--drawer-reset-button-hover-color, var(--default-drawer-reset-button-hover-color))
        );
    }

    .counter {
        display: inline-block;
        width: 15px;
        margin: 0 10px;
        font-size: 18px;
    }

    .anchorResetBtn {
        color: var(
            --prop-drawer-reset-button-text-color,
            var(--drawer-reset-button-text-color, var(--default-reset-drawer-button-text-color))
        );
        background-color: var(
            --prop-drawer-reset-button-color,
            var(--drawer-reset-button-color, var(--default-drawer-reset-button-color))
        );
        box-shadow: 0 0 0 var(--final-border-width) var(--final-border-color),
            var(--default-node-shadow);
    }

    .anchorResetBtn:hover {
        color: var(
            --prop-drawer-reset-button-hover-text-color,
            var(
                --drawer-reset-button-hover-text-color,
                var(--default-drawer-reset-button-hover-text-color)
            )
        );
        background-color: var(
            --prop-drawer-reset-button-hover-color,
            var(--drawer-reset-button-hover-color, var(--default-drawer-reset-button-hover-color))
        );
    }

    .anchor-directions {
        display: flex;
        justify-content: space-around;
        margin: 0;
    }
</style>
