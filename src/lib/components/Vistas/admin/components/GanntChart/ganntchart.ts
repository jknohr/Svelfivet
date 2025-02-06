export interface Workflow {
    id: string;
    name: string;
    duration: number;
    dependencies: string[];
    pipelineId?: string;
}

export interface Pipeline {
    id: string;
    name: string;
    workflows: Workflow[];
}

export interface GanttChartData {
    pipelines: Pipeline[];
}

export function topologicalSort(pipelines: Pipeline[]): Workflow[] {
    const visited = new Set<string>();
    const sorted: Workflow[] = [];

    function visit(workflow: Workflow) {
        if (visited.has(workflow.id)) return;
        visited.add(workflow.id);
        workflow.dependencies.forEach(dep => {
            const depWorkflow = pipelines
                .flatMap(p => p.workflows)
                .find(wf => wf.id === dep);
            if (depWorkflow) {
                visit(depWorkflow);
            }
        });
        sorted.push(workflow);
    }

    pipelines.forEach(pipeline => {
        pipeline.workflows.forEach(workflow => {
            visit(workflow);
        });
    });

    return sorted;
}