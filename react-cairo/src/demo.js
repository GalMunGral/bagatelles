const path = require("path");
const React = require("react");
const {
  Document,
  Page,
  Text,
  Image,
  View,
  Font,
  StyleSheet,
} = require("@react-pdf/renderer");

Font.register({
  family: "Roboto",
  src: path.resolve(__dirname, "../fonts/Arial Unicode.ttf"),
});

const styles = StyleSheet.create({
  page: { fontFamily: "Roboto", color: "white" },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start",
  },
  title: {
    fontSize: 30,
    marginTop: 120,
  },
  row: {
    marginTop: 80,
    width: "70%",
    padding: "0 20px",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallText: {
    fontSize: 20,
    textAlign: "left",
    width: 70,
    flex: 0,
  },
});

const Demo = ({ data }) => (
  <Document>
    <Page size={[375, 667]} style={styles.page}>
      <Image
        style={{ height: "100%", width: "100%", position: "absolute" }}
        src="http://gllueassets.oss.aliyuncs.com/hunter_board/temp2/%E9%A1%BE%E9%97%AE%E5%A5%96%E9%A1%B9%20-%20%E6%9C%80%E4%BD%B3%E6%96%B0%E7%A7%80-08fec0dfe162dc95b17ac995c32007b1.png"
      />
      <View style={styles.container}>
        <Text style={styles.title}>{data.name}</Text>
        <View style={styles.row}>
          <View style={styles.smallText}>
            <Text>{data.achievement}</Text>
          </View>
          <View style={styles.smallText}>
            <Text>{data.rank}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

module.exports = Demo;
