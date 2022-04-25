//
//  GraphView.swift
//  DiskInfo
//
//  Created by Wenqi He on 6/7/19.
//  Copyright © 2019 erndev. All rights reserved.
//

import Cocoa

fileprivate struct Constants {
  static let barHeight: CGFloat = 30.0
  static let barMinHeight: CGFloat = 20.0
  static let barMaxHeight: CGFloat = 40.0
  static let marginSize: CGFloat = 20.0
  static let pieChartWidthPercentage: CGFloat = 1.0 / 3.0
  static let pieChartBorderWidth: CGFloat = 1.0
  static let pieChartMinRadius: CGFloat = 30.0
  static let pieChartGradientAngle: CGFloat = 90.0
  static let barChartCornerRadius: CGFloat = 4.0
  static let barChartLegendSquareSize: CGFloat = 8.0
  static let legendTextMargin: CGFloat = 5.0
}

class GraphView: NSView {
  
  fileprivate var bytesFormatter = ByteCountFormatter()
  var fileDistribution: FilesDistribution? {
    didSet {
      needsDisplay = true
    }
  }

  
  override func draw(_ dirtyRect: NSRect) {
    super.draw(dirtyRect)
    
    let context = NSGraphicsContext.current?.cgContext
    drawBarGraph(in: context)
    drawPieChart()
  }

  func colorsForFileType(fileType: FileType) -> (strokeColor: NSColor, fillColor: NSColor) {
    switch fileType {
    case .audio(_, _):
      return (strokeColor: NSColor.audioStrokeColor, fillColor: NSColor.audioFillColor)
    case .movies(_, _):
      return (strokeColor: NSColor.moviesStrokeColor, fillColor: NSColor.moviesFillColor)
    case .photos(_, _):
      return (strokeColor: NSColor.photosStrokeColor, fillColor: NSColor.photosFillColor)
    case .apps(_, _):
      return (strokeColor: NSColor.appsStrokeColor, fillColor: NSColor.appsFillColor)
    case .other(_, _):
      return (strokeColor: NSColor.othersStrokeColor, fillColor: NSColor.othersFillColor)
    }
  }
  
}

// MARK: - Dimensions calculations
extension GraphView {
  func pieChartRectangle() -> CGRect {
    let width = bounds.size.width * Constants.pieChartWidthPercentage - 2 * Constants.marginSize
    let height = bounds.size.height - 2 * Constants.marginSize
    let diameter = max(min(width, height), Constants.pieChartMinRadius)
    return CGRect(x: Constants.marginSize, y: bounds.midY - diameter / 2.0,
                  width: diameter, height: diameter)
  }
  
  func barChartRectangle() -> CGRect {
    let pieChartRect = pieChartRectangle()
    let width = bounds.size.width - pieChartRect.maxX - 3 * Constants.marginSize
    return CGRect(x: pieChartRect.maxX + Constants.marginSize, y: pieChartRect.midY + Constants.marginSize,
                  width: width, height: Constants.barHeight)
  }
  
  func barChartLegendRectangle() -> CGRect {
    let barchartRect = barChartRectangle()
    return barchartRect.offsetBy(dx: 0.0, dy: -(barchartRect.size.height + 2 * Constants.marginSize))
  }
}


// MARK: - Drawing extension
extension GraphView {
  
  func drawPieChart() {
    // Draw background
    guard let fileDistribution = fileDistribution else { return }
    let boundingRect = pieChartRectangle()
    let circle = NSBezierPath(ovalIn: boundingRect)
    NSColor.availableFillColor.setFill()
    NSColor.availableStrokeColor.setStroke()
    circle.fill()
    circle.stroke()
    // Draw outline
    let center = CGPoint(x: boundingRect.midX, y: boundingRect.midY)
    let endAngle = CGFloat(Double(fileDistribution.capacity - fileDistribution.available) / Double(fileDistribution.capacity) * 360)
    let radius = boundingRect.width / 2
    let path = NSBezierPath()
    path.move(to: center)
    path.line(to: CGPoint(x: center.x + radius, y: center.y))
    path.appendArc(withCenter: center, radius: radius, startAngle: 0, endAngle: endAngle)
    path.close()
    NSColor.pieChartUsedStrokeColor.setStroke()
    path.stroke()
    // Fill in gradient
    let startColor = NSColor.pieChartGradientStartColor
    let endColor = NSColor.pieChartGradientEndColor
    if let gradient = NSGradient(starting: startColor, ending: endColor) {
      gradient.draw(in: path, angle: Constants.pieChartGradientAngle)
    }
    
    // Helper function
    func drawPieChartText(byteCount: Int64, at angle: CGFloat, inColor color: NSColor) {
      let text = NSString(string: bytesFormatter.string(fromByteCount: byteCount))
      let center = CGPoint(x: center.x + radius / 2 * cos(angle.radians) , y: center.y + radius / 2 * sin(angle.radians))
      let attributes: [NSAttributedString.Key : Any] =  [
        NSAttributedString.Key.font: NSFont.pieChartLegendFont,
        NSAttributedString.Key.foregroundColor: color
      ]
      let textSize = text.size(withAttributes: attributes)
      let textRect = CGRect(x: center.x - textSize.width / 2,
                                 y: center.y - textSize.height / 2,
                                 width: textSize.width,
                                 height: textSize.height)
      text.draw(in: textRect, withAttributes: attributes)
    }
    
    // Draw text on pie chart
    drawPieChartText(byteCount: fileDistribution.available, at: (endAngle + 360) / 2.0,
                     inColor: .pieChartAvailableSpaceTextColor)
    drawPieChartText(byteCount: fileDistribution.capacity - fileDistribution.available, at: endAngle / 2.0,
                     inColor: .pieChartUsedSpaceTextColor)
  }
  
  func drawRoundedRect(_ rect: CGRect, in context: CGContext,
                       withRadius radius: CGFloat, borderColor: CGColor, fillColor: CGColor) {
    let path = CGMutablePath()
    path.move(to: CGPoint(x: rect.midX, y: rect.minY))
    path.addArc(tangent1End: CGPoint(x: rect.maxX, y: rect.minY),
                tangent2End: CGPoint(x: rect.maxX, y: rect.maxY), radius: radius)
    path.addArc(tangent1End: CGPoint(x: rect.maxX, y: rect.maxY),
                tangent2End: CGPoint(x: rect.minX, y: rect.maxY), radius: radius)
    path.addArc(tangent1End: CGPoint(x: rect.minX, y: rect.maxY),
                tangent2End: CGPoint(x: rect.minX, y: rect.minY), radius: radius)
    path.addArc(tangent1End: CGPoint(x: rect.minX, y: rect.minY),
                tangent2End: CGPoint(x: rect.maxX, y: rect.minY), radius: radius)
    path.closeSubpath()
    
    context.setLineWidth(1)
    context.setFillColor(fillColor)
    context.setStrokeColor(borderColor)
    context.addPath(path)
    context.drawPath(using: .fillStroke)
  }
  
  func drawBarGraph(in context: CGContext?) {
    guard let context = context, let fileTypes = fileDistribution?.distribution,
      let capacity = fileDistribution?.capacity, capacity > 0 else { return }

    let barChartRect = barChartRectangle()
    drawRoundedRect(barChartRect, in: context, withRadius: Constants.barChartCornerRadius,
                    borderColor: NSColor.availableStrokeColor.cgColor, fillColor: NSColor.availableFillColor.cgColor)

    // Draw the distributions
    var clipRect = barChartRect
    let legendRectWidth = (barChartRect.size.width / CGFloat(fileTypes.count))

    for (index, fileType) in fileTypes.enumerated() {
      let fileTypeInfo = fileType.fileTypeInfo
      clipRect.size.width = floor(barChartRect.width * CGFloat(fileTypeInfo.percent))
      context.saveGState()
      context.clip(to: clipRect)
      let fileTypeColors = colorsForFileType(fileType: fileType)
      drawRoundedRect(barChartRect, in: context, withRadius: Constants.barChartCornerRadius,
                      borderColor: fileTypeColors.strokeColor.cgColor,
                      fillColor: fileTypeColors.fillColor.cgColor)
      context.restoreGState()
      clipRect.origin.x = clipRect.maxX
      
      // DRAW LEGENDS
      let legendOriginX = barChartRect.origin.x + floor(CGFloat(index) * legendRectWidth)
      let legendOriginY = barChartRect.minY - 2 * Constants.marginSize
      
      // Draw legend square
      let legendSquareRect = CGRect(x: legendOriginX, y: legendOriginY,
                                    width: Constants.barChartLegendSquareSize,
                                    height: Constants.barChartLegendSquareSize)
      let legendSquarePath = CGMutablePath()
      legendSquarePath.addRect(legendSquareRect)
      context.addPath(legendSquarePath)
      context.setFillColor(fileTypeColors.fillColor.cgColor)
      context.setStrokeColor(fileTypeColors.strokeColor.cgColor)
      context.drawPath(using: .fillStroke)
      
      // Draw legend texts
      let paragraphStyle: NSMutableParagraphStyle = {
        let style = NSMutableParagraphStyle()
        style.lineBreakMode = .byTruncatingTail
        style.alignment = .left
        return style
      }()
      
      let legendName: NSString = NSString(string: fileType.name)
      let nameTextAttributes: [NSAttributedString.Key : Any] = [
        NSAttributedString.Key.font: NSFont.barChartLegendNameFont,
        NSAttributedString.Key.foregroundColor: NSColor.textColor, // IMPORTANT: Need this for dark mode!
        NSAttributedString.Key.paragraphStyle: paragraphStyle
      ]
      let nameTextSize = legendName.size(withAttributes: nameTextAttributes)
      let legendTextOriginX = legendSquareRect.maxX + Constants.legendTextMargin
      let legendTextOriginY = legendOriginY - 2 * Constants.pieChartBorderWidth
      let legendNameRect = CGRect(x: legendTextOriginX, y: legendTextOriginY,
                                  width: legendRectWidth - legendSquareRect.size.width - 2 * Constants.legendTextMargin,
                                  height: nameTextSize.height)
      legendName.draw(in: legendNameRect, withAttributes: nameTextAttributes)
      
      let detailText = NSString(string: bytesFormatter.string(fromByteCount: fileTypeInfo.bytes))
      let detailTextAttributes: [NSAttributedString.Key : Any] = [
        NSAttributedString.Key.font: NSFont.barChartLegendSizeTextFont,
        NSAttributedString.Key.foregroundColor: NSColor.secondaryLabelColor,
        NSAttributedString.Key.paragraphStyle: paragraphStyle
      ]
      let detailTextSize = detailText.size(withAttributes: detailTextAttributes)
      let detailTextRect = legendNameRect.offsetBy(dx: 0, dy: -detailTextSize.height)
      detailText.draw(in: detailTextRect, withAttributes: detailTextAttributes)    
    }
  }
}

