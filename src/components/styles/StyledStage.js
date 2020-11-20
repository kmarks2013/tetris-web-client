import styled from 'styled-components'

export const StyledStage = styled.div`
    margin: 0 0 0 40px;
    display: grid;
    grid-template-rows: repeat(
        ${props => props.height},
        calc(25vw / ${props => props.width})
    );
    grid-template-columns: repeat(
        ${props => props.width}, 1fr
    );
    grid-gap: 1px;
    border: 2px ridge #333;
    width: 100%;
    max-width: 25vw;
    height:fit-content;
    background-color: #222;
`
