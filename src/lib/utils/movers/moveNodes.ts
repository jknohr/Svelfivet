import type { Node, Graph, XYPair, GroupBox, GroupKey } from '$lib/types';
import { initialClickPosition, tracking } from '$lib/stores';

const buffer = 10;

export function captureGroup(group: Set<Node | GroupBox>): XYPair[] {
	const groupArray = Array.from(group);
	return groupArray.map((node) => node.position);
}

export function moveNodes(graph: Graph, snapTo: number) {
	let animationFrame: number;
	const groups = graph.groups;
	const groupName = graph.activeGroup;

	if (!groupName) return;

	const nodeGroup = groups[groupName].nodes;

	if (!nodeGroup) return;

	const initialPositions = graph.initialNodePositions;
	const { x: initialClickX, y: initialClickY } = initialClickPosition;

	const nodeGroupArray = Array.from(nodeGroup);
	const groupBoxes = graph.groupBoxes;

	nodeGroupArray.forEach((node) => node.moving = true);

	moveGroup();

	function moveGroup() {
		const cursorPosition = graph.cursor;

		let newX = cursorPosition.x - initialClickX;
		let newY = cursorPosition.y - initialClickY;

		if (snapTo) {
			newX -= newX % snapTo;
			newY -= newY % snapTo;
		}

		const delta = { x: newX, y: newY };

		nodeGroupArray.forEach((node, index) => {
			const { group, position } = node;

			const initialPosition = initialPositions[index];

			let groupBox: GroupBox | undefined;

			if (groupName === 'selected' && group) {
				const localGroupName = group as GroupKey;
				groupBox = groupBoxes.get(localGroupName) ?? undefined;
			}

			if (!groupBox) {
				moveElement(initialPosition, delta, position);
			} else {
				const nodeWidth = node.dimensions.width;
				const nodeHeight = node.dimensions.height;
				const bounds = calculateRelativeBounds(groupBox, nodeWidth, nodeHeight);
				moveElementWithBounds(initialPosition, delta, position, bounds);
			}
		});

		if (tracking) {
			animationFrame = requestAnimationFrame(moveGroup);
		} else {
			cancelAnimationFrame(animationFrame);
		}
	}
}

export function moveElement(initialPosition: XYPair, delta: XYPair, position: XYPair) {
	position.x = initialPosition.x + delta.x;
	position.y = initialPosition.y + delta.y;
}

export function moveElementWithBounds(
	initialPosition: XYPair,
	delta: XYPair,
	position: XYPair,
	bounds: { left: number; right: number; top: number; bottom: number }
) {
	position.x = Math.min(Math.max(bounds.left, initialPosition.x + delta.x), bounds.right);
	position.y = Math.min(Math.max(bounds.top, initialPosition.y + delta.y), bounds.bottom);
}

export function calculateRelativeBounds(groupBox: GroupBox, nodeWidth: number, nodeHeight: number) {
	const { x: groupBoxX, y: groupBoxY } = groupBox.position;
	return {
		left: groupBoxX + buffer,
		right: groupBoxX + groupBox.dimensions.width - nodeWidth - buffer,
		top: groupBoxY + buffer,
		bottom: groupBoxY + groupBox.dimensions.height - nodeHeight - buffer
	};
}
