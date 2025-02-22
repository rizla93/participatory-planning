import SceneView from "@arcgis/core/views/SceneView";
import * as promiseUtils from "@arcgis/core/core/promiseUtils";
import ViewshedAnalysis from "@arcgis/core/analysis/ViewshedAnalysis.js";

// Declare abortController outside the function to make it accessible throughout the file
let abortController: AbortController | null = null;
let viewshedAnalysis: ViewshedAnalysis | null = null;

export async function createViewshed({
    view
}: {
    view: SceneView,
}) {
    viewshedAnalysis = new ViewshedAnalysis()
    view.analyses.add(viewshedAnalysis)

    // Access the viewshed's analysis view.
    const analysisView = await view.whenAnalysisView(viewshedAnalysis);

    // Make the analysis interactive and select the programmatically created viewshed.
    analysisView.interactive = true;
    
    // Stop any pending creation operation.
    stopCreating();

    // Create a new abort controller for the new operation.
    abortController = new AbortController();

    // Pass the controller as an argument to the interactive creation method.
    analysisView
      .createViewsheds({ signal: abortController.signal })

      .catch((e) => {
        // When the operation is stopped, don't do anything. Any other errors are thrown.
        if (!promiseUtils.isAbortError(e)) {
          throw e;
        }
      })
}

function stopCreating() {
    if (abortController) {
        abortController.abort();
        abortController = null;
    }
}