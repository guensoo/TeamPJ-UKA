import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

const SecretToggle = ({ isSecret, setIsSecret, password, setPassword }) => (
    <div style={{ marginTop: '16px' }}>
        <FormControlLabel
            control={
                <Switch
                    checked={isSecret}
                    onChange={e => setIsSecret(e.target.checked)}
                    color="primary"
                />
            }
            label="비밀글로 등록"
        />
        {isSecret && (
            <div style={{ marginTop: 8 }}>
                <TextField
                    label="비밀번호 (4자리 숫자)"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]{4}',
                        maxLength: 4,
                        minLength: 4,
                        style: { fontSize: 16 }
                    }}
                    style={{ width: '98%' }}
                    required
                />
            </div>
        )}
    </div>
);

export default SecretToggle;