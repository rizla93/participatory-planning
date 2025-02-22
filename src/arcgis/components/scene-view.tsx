/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createContext, forwardRef, PropsWithChildren, useContext, useEffect, useState } from "react"
import ArcgisSceneView from '@arcgis/core/views/SceneView';

import '@arcgis/core/assets/esri/themes/dark/main.css'
import { useWebScene } from "./web-scene";
import Expand from '@arcgis/core/widgets/Expand';
import Weather from '@arcgis/core/widgets/Weather';
import Daylight from '@arcgis/core/widgets/Daylight';

export const SceneView = forwardRef<ArcgisSceneView, PropsWithChildren>(function SceneView(props, ref) {
  const [view] = useState(() => new ArcgisSceneView({
    popupEnabled: false
  }));

  const scene = useWebScene();

  useEffect(() => {
    view.map = scene!;
    if (!view.ui.find("weatherExpand")) { // Check if the widget is already added
      addWeatherAndLight(view);
    }
  }, [scene, view]);

  return (
    <SceneViewProvider view={view}>
      <div
        ref={node => {
          if (node) view.container = node
          if (ref && typeof ref === 'function') ref(view);
          else if (ref) ref.current = view;
        }}
        className="w-full h-full"
      />
      {props.children}
    </SceneViewProvider>
  )
})

const SceneViewContext = createContext<ArcgisSceneView>(null!);

function SceneViewProvider({ view, children }: PropsWithChildren<{ view: ArcgisSceneView }>) {
  return (
    <SceneViewContext.Provider value={view}>
      {children}
    </SceneViewContext.Provider>
  )
}

export function addWeatherAndLight(view: ArcgisSceneView){
  const weatherExpand = new Expand({
    id: "weatherExpand", // Add an id to the widget
    view: view,
    content: new Weather({
      view: view
    }),
    group: "top-right",
    expanded: false
  });

  const daylightExpand = new Expand({
    id: "daylightExpand", // Add an id to the widget
    view: view,
    content: new Daylight({
      view: view
    }),
    group: "top-right"
  });
  view.ui.add([weatherExpand, daylightExpand], "top-right");
}

export function useSceneView() {
  return useContext(SceneViewContext);
}