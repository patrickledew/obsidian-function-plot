
import * as React from "react";
import functionPlot from "function-plot";
import { FunctionPlotOptions } from "function-plot/dist/types";
import { OFPSettings } from "../../settings";


const parseRange = (rangeStr: string): [number, number] => {
    const str = rangeStr.trim();
    const matches = str.match(/(?:\[|\()\s*((?:\+|-)?\d*\.*\d*)\s*,\s*((?:\+|-)?\d*\.*\d*)\s*(?:\)|\])/)
    if (matches === null || matches.length < 2) return null;
    return [parseFloat(matches[1]), parseFloat(matches[2])]
}


export const FunctionPlotView : React.FC<{src: string, settings: OFPSettings}> = React.memo(({ src, settings }) => {
    const plotContainerRef = React.useRef(null);
    const [ err, setErr ] = React.useState<string>("");

/* Parses the source code block to extract options.
 *  Lines that start with the options prefix (default %) are considered options. Any other line is interpreted as a function unless it is empty.
 *  e.g.
 *  ```plot
 *     %range []
 *     %domain []
 *     %title Sin of X Squared
 * 
 *     sin(x^2)
 *  ```
 */
 const parseCodeBlock = (): Partial<FunctionPlotOptions> => {
    const plotOptions: Partial<FunctionPlotOptions> = {
        grid: false,
        xAxis: {
            domain: null
        },
        yAxis: {
            domain: null
        },
        data: []
    };
    const s = src.trim()
    const lines = s.split("\n");
    for (const lineNum in lines) {
        const line = lines[lineNum].trim()
        if (line.length == 0) continue; // It's just an empty line
        
        if (line[0] == settings.optionsPrefix) {
            const hasSpace = line.indexOf(' ') !== -1;
            const setting = (hasSpace ? line.substring(1, line.indexOf(' ')) : line.substring(1)).toLowerCase() // Gets the text that is after the option prefix
            const value = hasSpace ? line.substring(line.indexOf(' ') + 1).trim() : null; 
            switch(setting) {
                case "grid":
                    plotOptions.grid = true;
                    break;
                case "xrange": {
                    if (!value) {
                        setErr(err + `Must provide a parameter for option ${settings.optionsPrefix}xrange. Format: ${settings.optionsPrefix}xrange [xmin, xmax]\n`);
                    }
                    
                    const range = parseRange(value);
                    if (range === null)
                        setErr(err + `Parameter for option ${settings.optionsPrefix}xrange could not be parsed. Format: ${settings.optionsPrefix}xrange [xmin, xmax]\n`);
                    else
                        plotOptions.xAxis.domain = range;
                    break;
                }
                case "yrange": {
                    if (!value) {
                        setErr(err + `Must provide a parameter for option ${settings.optionsPrefix}yrange. Format: ${settings.optionsPrefix}yrange [ymin, ymax]\n`);
                    }
                    
                    const range = parseRange(value);
                    if (range === null)
                        setErr(err + `Parameter for option ${settings.optionsPrefix}yrange could not be parsed. Format: ${settings.optionsPrefix}yrange [ymin, ymax]\n`);
                    else
                        plotOptions.yAxis.domain = range;
                    break;
                }
            }
        } else {
            // Parse as a function
            plotOptions.data.push({fn: line, fnType: "linear"});
        }
    }
    return plotOptions;
}




    // When component loads, parse src and plot a function.
    React.useEffect(() => {
        try {
            const options = parseCodeBlock()
            functionPlot(Object.assign({} as FunctionPlotOptions, options, {target: plotContainerRef.current}))
        } catch(e) {
            // Display error message
            setErr(err + e.message + "\n")
        }
    }, [src, settings])

    return <div className="ofp-function-plot-view">
            <div className="ofp-function-plot-target"ref={plotContainerRef}></div>
            {err && <pre className="ofp-function-plot-error">Plot Error!<small><em>(If you believe this is a bug, <a href="https://github.com/meltedchocolate/obsidian-function-plot/issues">please submit an issue on GitHub.</a>)</em></small><br></br> <em>{err}</em></pre>}
        </div>
});