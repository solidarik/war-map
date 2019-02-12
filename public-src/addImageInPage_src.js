class AddImageInPage {

  constructor(svgElement, data, fieldName, imageName, imagePath, imageExt) {
    this.svgElement = svgElement;
    this.data = data;
    this.fieldName = fieldName;
    this.imageName = imageName;
    this.imagePath = imagePath;
    this.imageExt = imageExt;
  }


  addImageInPage() {
    let defs = this.svgElement.append("defs");

    let fieldName = this.fieldName;
    let imageName = this.imageName;
    let imagePath = this.imagePath;
    let imageExt = this.imageExt;


    let imgPattern = defs.selectAll("pattern").data(this.data)
      .enter()
      .append("pattern")
      .attr("id", function (d) { return imageName + d[fieldName]; })
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("patternUnits", "objectBoundingBox")
      .attr("patternContentUnits", "objectBoundingBox")
      .append("image")
      .attr("width", 1)
      .attr("height", 1)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", function (d) { return imagePath + d[fieldName] + imageExt; });

    return imgPattern;
  }

}