import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        topColor: string;
        topBorderColor: string;
        topTextColor: string;
        bgColor: string;
        baseBgColor: string;
        boardColor: string;
        cardColor: string;
        textColor: string;
        inputColor: string;
        BoardBoxShadowColor1: string;
        BoardBoxShadowColor2: string;
        CardBoxShadowColor1: string;
        CardBoxShadowColor2: string;
        isDraggingOverColor: string;
        iconHoverColor: string;
        iconBoxBgColor: string;
    }
}