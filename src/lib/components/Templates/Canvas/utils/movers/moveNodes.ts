import type { Node, Graph, XYPair, GroupBox, GroupKey } from '../../types/logic';

const buffer = 10;

export function captureGroup(group: Set<Node | GroupBox>): XYPair[] {
	const groupArray = Array.from(group);
	return groupArray.map((node) => node.position);
}

interface ExtendedGraph extends Graph {
	activeGroup?: GroupKey | 'selected';
	initialNodePositions: XYPair[];
	cursor: XYPair;
	initialClick: XYPair;
	tracking: boolean;
}

export function moveNodes(graph: ExtendedGraph, snapTo: number) {
	let animationFrame: number;
	const groups = graph.groups;
	const groupName = graph.activeGroup;

	if (!groupName || groupName === 'selected') return;

	const groupBox = groups.get(groupName);
	if (!groupBox) return;

	const nodeGroup = groupBox.nodes;
	if (!nodeGroup) return;

	const initialPositions = graph.initialNodePositions;
	const initialClick = graph.initialClick;
	const tracking = graph.tracking;

	const nodeGroupArray = Array.from(nodeGroup) as unknown as Node[];
	const groupBoxes = graph.groups;

	nodeGroupArray.forEach((node) => node.moving = true);

	moveGroup();

	function moveGroup() {
		const cursorPosition = graph.cursor;

		let newX = cursorPosition.x - initialClick.x;
		let newY = cursorPosition.y - initialClick.y;

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
				groupBox = groupBoxes.get(group);
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
