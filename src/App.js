import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import pinyinData from './pinyins.json';
import syllablesData from './syllables.json';
import syllableToPinyins from './syllableToPinyins.json';

function getMp3Url(id) {
    return `https://tone.lib.msu.edu/tone/${id}/datastream/PROXY_MP3/download`;
}

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    tableHeader: {
        fontWeight: 'bold',
        fontSizeAdjust: 0.6,
        color: '#333333',
        textTransform: 'uppercase'
    },
    musicButton: {
        textTransform: 'capitalize',
        fontWeight: 300
    }
});

class MusicButton extends Component {
    state = {
        anchorEl: null
    };

    handleClick = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = pinyinNum => {
        if (pinyinNum !== undefined) {
            const pinyin = this.props.pinyins[pinyinNum];
            const pinyinIds = pinyinData[pinyin];
            const pinyinId = pinyinIds[Math.floor(Math.random() * pinyinIds.length)];
            const url = getMp3Url(pinyinId);
            if (this.audio !== undefined) {
                this.audio.pause();
            }
            this.audio = new Audio(url);
            this.audio.play();
        }
        this.setState({anchorEl: null});
    };

    render() {
        const {anchorEl} = this.state;
        return (
            <div>
                <Button
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    className={this.props.classes.musicButton}
                >
                    {this.props.children}
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    {this.props.pinyins.map((pinyin, i) => <MenuItem
                        onClick={() => this.handleClose(i)}>{pinyin}</MenuItem>)}
                </Menu>
            </div>
        );
    }
}

let initials = [
    '∅', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'
];
let finals = [
    'i', 'a', 'e', 'ê', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'er', 'ia', 'io', 'ie', 'iai', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'u', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'ong', 'ü', 'üe', 'üan', 'ün', 'iong'
];


const SoundCell = props => {
    const syllable = syllablesData[props.initial][props.final];
    if (syllable.length === 0) {
        return <TableCell/>;
    }
    const pinyins = syllableToPinyins[syllable];
    if (pinyins === undefined || pinyins.length === 0) {
        return <TableCell/>;
    }
    return <TableCell align="center"><MusicButton classes={props.classes}
                                                  pinyins={pinyins}>{syllable}</MusicButton></TableCell>
};

function SoundTable(props) {
    const {classes} = props;

    return (
        <Table className={classes.table} padding='none'>
            <TableBody><TableRow>
                <TableCell/>
                {finals.map(final => <TableCell key={final} align="center"
                                                className={classes.tableHeader}>{final}</TableCell>)}
            </TableRow>
                {initials.map(initial => (
                    <TableRow key={initial}>
                        <TableCell align="right" className={classes.tableHeader}>
                            {initial}
                        </TableCell>
                        {finals.map(final => <SoundCell key={final} classes={classes} initial={initial}
                                                        final={final}/>)}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

SoundTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SoundTable);
