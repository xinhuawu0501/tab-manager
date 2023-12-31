const width = "20px";
const height = "20px";

export const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 30 30"
    >
      <path
        fill="#C3301C"
        d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"
      ></path>
    </svg>
  );
};

export const BookmarkedIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 64 64"
    >
      <path d="M41.148,10C43.827,10,46,12.173,46,14.852v37.406c0,1.945-2.338,2.934-3.734,1.58L32,43.877l-10.266,9.961	C20.338,55.192,18,54.203,18,52.258V14.852C18,12.173,20.173,10,22.852,10H41.148z"></path>
    </svg>
  );
};

export const UnBookmarkedIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 64 64"
    >
      <path d="M41.148,14H22.852C22.382,14,22,14.382,22,14.852v32.36c0,0.297,0.357,0.448,0.57,0.241l8.557-8.303	c0.487-0.472,1.26-0.472,1.747,0l8.557,8.303C41.643,47.66,42,47.509,42,47.213v-32.36C42,14.382,41.618,14,41.148,14z M41.148,10	C43.827,10,46,12.173,46,14.852v37.46c0,1.925-2.314,2.903-3.695,1.563L32,43.877l-10.305,9.999C20.314,55.216,18,54.237,18,52.313	v-37.46C18,12.173,20.173,10,22.852,10H41.148z"></path>
    </svg>
  );
};

export const DragIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height={height}
      viewBox="6 0 10 15"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7 5H9V7H7V5ZM12 5H14V7H12V5ZM7 9H9V11H7V9ZM12 9H14V11H12V9ZM7 13H9V15H7V13ZM12 13H14V15H12V13Z"
        fill="#545454"
      />
    </svg>
  );
};

export const OpenLinkIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 55 55"
    >
      <path d="M 40.960938 4.9804688 A 2.0002 2.0002 0 0 0 40.740234 5 L 28 5 A 2.0002 2.0002 0 1 0 28 9 L 36.171875 9 L 22.585938 22.585938 A 2.0002 2.0002 0 1 0 25.414062 25.414062 L 39 11.828125 L 39 20 A 2.0002 2.0002 0 1 0 43 20 L 43 7.2460938 A 2.0002 2.0002 0 0 0 40.960938 4.9804688 z M 12.5 8 C 8.3826878 8 5 11.382688 5 15.5 L 5 35.5 C 5 39.617312 8.3826878 43 12.5 43 L 32.5 43 C 36.617312 43 40 39.617312 40 35.5 L 40 26 A 2.0002 2.0002 0 1 0 36 26 L 36 35.5 C 36 37.446688 34.446688 39 32.5 39 L 12.5 39 C 10.553312 39 9 37.446688 9 35.5 L 9 15.5 C 9 13.553312 10.553312 12 12.5 12 L 22 12 A 2.0002 2.0002 0 1 0 22 8 L 12.5 8 z"></path>
    </svg>
  );
};
