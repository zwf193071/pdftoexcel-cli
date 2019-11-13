const React = require('react')
const importJsx = require('import-jsx')
const { render, Box } = require('ink')
const { Table, RowSpan, Caption, Tr, Th, Td } = importJsx('./table')

const Section = ({ children }) => (
    <Box marginBottom={1} marginTop={1} flexDirection="column">
        {children}
    </Box>
)

const TimesCli = ({ titles, tbodys }) => (
    <React.Fragment>
        <Section>
            <Table>
                <Caption>统计检索名称</Caption>
                <Tr>
                    {
                        titles.map((item, i) => {
                            return <Th key={i}>{item}</Th>
                        })
                    }
                </Tr>
                <Tr>
                    {
                        tbodys.map((item, i) => {
                            return <Box key={i}>
                                <RowSpan key={item.nameKey}>{item.name}</RowSpan>
                                <Td key={item.timesKey}>{item.times}</Td>
                            </Box>
                        })
                    }
                </Tr>
            </Table>
        </Section>
    </React.Fragment>
)

module.exports = props => render(<TimesCli {...props} />)