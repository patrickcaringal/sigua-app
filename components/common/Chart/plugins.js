export const chartplugin = {
  datalabels: {
    display: true,
    color: "#fff",
    font: {
      weight: "bold",
      size: 20,
    },
    display: (context) => context.dataset.data[context.dataIndex] !== 0,
  },
  customCanvasBackgroundColor: {
    color: "#fff",
  },
};
